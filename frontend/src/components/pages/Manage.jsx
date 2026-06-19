import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadWidget from '../UploadWidget/UploadWidget'
import './Manage.css'

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

const EMPTY_ITEM = {
  menu_item_name: '',
  menu_item_description: '',
  menu_item_category: '',
  menu_item_price: '',
  menu_item_image: '',
}

// Friendly labels shown in the UI, decoupled from the backend field keys. The
// request body still sends menu_item_* keys (the model is unchanged) — only the
// <label> text the admin sees changes.
const FIELD_LABELS = {
  menu_item_name: 'Name',
  menu_item_description: 'Description',
  menu_item_category: 'Category',
  menu_item_price: 'Price',
  menu_item_image: 'Image',
}

// Text fields rendered by the shared field loop (image is handled separately
// via UploadWidget below).
const TEXT_FIELDS = ['menu_item_name', 'menu_item_description', 'menu_item_category', 'menu_item_price']

// ~110px rounded square showing the current image, or a neutral placeholder when
// none is set. Mirrors the public menu crop (object-fit: cover) so admins see
// the real result.
function imagePreview(url) {
  if (url) {
    return (
      <div className="manage-img-preview">
        <img src={url} alt="menu item preview" />
      </div>
    )
  }
  return <div className="manage-img-preview manage-img-preview--empty">No image yet</div>
}

export default function Manage() {
  const [tab, setTab] = useState('menu')
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState(EMPTY_ITEM)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null) // null = "All"
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (tab === 'menu') fetchMenuItems()
    if (tab === 'orders') fetchOrders()
  }, [tab])

  async function fetchMenuItems() {
    const res = await fetch('/api/admin/menu-items')
    if (res.status === 401) return navigate('/login')
    if (res.status === 403) return setError('Access denied — admin only.')
    setMenuItems(await res.json())
  }

  async function fetchOrders() {
    const res = await fetch('/api/admin/orders')
    if (res.status === 401) return navigate('/login')
    if (res.status === 403) return setError('Access denied — admin only.')
    setOrders(await res.json())
  }

  // Returns a finite Number for a price field, or null if the input is empty /
  // non-numeric. Centralised so add + edit validate the same way and we never
  // ship NaN (JSON serialises NaN as null -> Mongoose "price required" 500).
  function parsePrice(value) {
    const str = String(value).trim()
    if (str === '') return null
    const num = Number(str)
    return Number.isFinite(num) ? num : null
  }

  async function saveEdit(id) {
    const price = parsePrice(editingItem.menu_item_price)
    if (price === null) {
      setFormError('Enter a valid price (a number).')
      return
    }
    const res = await fetch(`/api/admin/menu-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editingItem, menu_item_price: price }),
    })
    if (res.ok) {
      const updated = await res.json()
      setMenuItems(menuItems.map(i => (i._id === id ? updated : i)))
      setEditingItem(null)
      setFormError(null)
    } else {
      setFormError('Failed to save changes. Try again.')
    }
  }

  async function addItem() {
    const price = parsePrice(newItem.menu_item_price)
    if (price === null) {
      setFormError('Enter a valid price (a number).')
      return
    }
    const res = await fetch('/api/admin/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, menu_item_price: price }),
    })
    if (res.ok) {
      const created = await res.json()
      setMenuItems([...menuItems, created])
      setNewItem(EMPTY_ITEM)
      setShowAddForm(false)
      setFormError(null)
    } else {
      setFormError('Failed to add item. Check the fields and try again.')
    }
  }

  async function changeOrderStatus(id, status) {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrders(orders.map(o => (o._id === id ? updated : o)))
    }
  }

  // Toggle the add form. When opening with a category chip active, prefill that
  // category so adding "within this category" is one less field to type.
  function toggleAddForm() {
    setFormError(null)
    if (showAddForm) {
      setShowAddForm(false)
      return
    }
    setNewItem({ ...EMPTY_ITEM, menu_item_category: activeCategory || '' })
    setShowAddForm(true)
  }

  // Renders the shared text fields + the image upload block for either the add
  // form (item=newItem) or the edit form (item=editingItem). setItem MUST use
  // the functional form so the once-built UploadWidget callback can't wipe other
  // fields with a frozen snapshot (see REFERENCES.md UploadWidget gotcha).
  function itemFields(item, setItem) {
    return (
      <>
        {TEXT_FIELDS.map(field => (
          <div key={field} className="manage-field">
            <label className="manage-label">{FIELD_LABELS[field]}</label>
            <input
              className="manage-input"
              type={field === 'menu_item_price' ? 'number' : 'text'}
              min={field === 'menu_item_price' ? '0' : undefined}
              step={field === 'menu_item_price' ? '0.01' : undefined}
              list={field === 'menu_item_category' ? 'category-options' : undefined}
              value={item[field]}
              onChange={e => setItem(prev => ({ ...prev, [field]: e.target.value }))}
            />
          </div>
        ))}
        <div className="manage-field">
          <label className="manage-label">{FIELD_LABELS.menu_item_image}</label>
          <div className="manage-image-row">
            {imagePreview(item.menu_item_image)}
            <UploadWidget
              onUploadSuccess={info => setItem(prev => ({ ...prev, menu_item_image: info.secure_url }))}
              onUploadError={() => setFormError('Image upload failed. Check your Cloudinary preset is unsigned.')}
            />
          </div>
        </div>
      </>
    )
  }

  if (error) return <p className="manage-error">{error}</p>

  // Distinct categories for the filter chips + the datalist suggestions, derived
  // client-side from the loaded items (same approach as MenuItems.jsx).
  const categories = [...new Set(menuItems.map(i => i.menu_item_category).filter(Boolean))]
  const visibleItems = activeCategory
    ? menuItems.filter(i => i.menu_item_category === activeCategory)
    : menuItems

  return (
    <div className="manage">
      <h1 className="manage-title">Management Dashboard</h1>

      <div className="manage-tabs">
        <button
          className={`manage-tab${tab === 'menu' ? ' manage-tab--active' : ''}`}
          onClick={() => setTab('menu')}
        >
          Menu Items
        </button>
        <button
          className={`manage-tab${tab === 'orders' ? ' manage-tab--active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {tab === 'menu' && (
        <div>
          {/* Shared across both add + edit category inputs */}
          <datalist id="category-options">
            {categories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>

          {categories.length > 0 && (
            <div className="manage-filter">
              <label className="manage-filter-label" htmlFor="category-filter">
                Filter by category
              </label>
              <div className="manage-filter-select-wrap">
                <select
                  id="category-filter"
                  className="manage-filter-select"
                  value={activeCategory ?? ''}
                  onChange={e => setActiveCategory(e.target.value || null)}
                >
                  <option value="">All categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <span className="manage-filter-count">
                {visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          )}

          <button
            className="manage-btn manage-add-toggle"
            onClick={toggleAddForm}
          >
            {showAddForm ? 'Cancel' : '+ Add Item'}
          </button>

          {showAddForm && (
            <div className="manage-card">
              <h3 className="manage-card-title">New Menu Item</h3>
              {itemFields(newItem, setNewItem)}
              {formError && <p className="manage-form-error">{formError}</p>}
              <div className="manage-form-actions">
                <button className="manage-btn" onClick={addItem}>Save</button>
              </div>
            </div>
          )}

          <ul className="manage-list">
            {visibleItems.map(item => (
              <li key={item._id}>
                {editingItem?._id === item._id ? (
                  <div className="manage-card">
                    {itemFields(editingItem, setEditingItem)}
                    {formError && <p className="manage-form-error">{formError}</p>}
                    <div className="manage-form-actions">
                      <button className="manage-btn" onClick={() => saveEdit(item._id)}>Save</button>
                      <button
                        className="manage-btn manage-btn--secondary"
                        onClick={() => { setEditingItem(null); setFormError(null) }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="manage-row">
                    <div className="manage-row-info">
                      <h3 className="manage-row-name">{item.menu_item_name}</h3>
                      <p className="manage-row-meta">
                        {item.menu_item_category} · ${item.menu_item_price}
                      </p>
                      {item.menu_item_description && (
                        <p className="manage-row-desc">{item.menu_item_description}</p>
                      )}
                      <div>
                        <button
                          className="manage-btn manage-btn--secondary"
                          onClick={() => { setEditingItem({ ...item }); setFormError(null) }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="manage-row-thumb">
                      {item.menu_item_image && (
                        <img src={item.menu_item_image} alt={item.menu_item_name} />
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {orders.length === 0 && <p className="manage-empty">No orders yet.</p>}
          {orders.map(order => (
            <div key={order._id} className="manage-card">
              <div className="manage-order-head">
                <div>
                  <strong>{order.user?.userName || order.user?.email}</strong>
                  <span className="manage-order-when">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                  <ul className="manage-order-items">
                    {order.items.map((i, idx) => (
                      <li key={idx}>{i.name} x{i.quantity} — ${i.price}</li>
                    ))}
                  </ul>
                </div>
                <select
                  className="manage-select"
                  value={order.status}
                  onChange={e => changeOrderStatus(order._id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
