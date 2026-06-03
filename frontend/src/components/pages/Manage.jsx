import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

const EMPTY_ITEM = {
  menu_item_name: '',
  menu_item_description: '',
  menu_item_category: '',
  menu_item_price: '',
  menu_item_image: '',
}

export default function Manage() {
  const [tab, setTab] = useState('menu')
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState(EMPTY_ITEM)
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState(null)
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

  async function saveEdit(id) {
    const res = await fetch(`/api/admin/menu-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem),
    })
    if (res.ok) {
      const updated = await res.json()
      setMenuItems(menuItems.map(i => (i._id === id ? updated : i)))
      setEditingItem(null)
    }
  }

  async function addItem() {
    const res = await fetch('/api/admin/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, menu_item_price: Number(newItem.menu_item_price) }),
    })
    if (res.ok) {
      const created = await res.json()
      setMenuItems([...menuItems, created])
      setNewItem(EMPTY_ITEM)
      setShowAddForm(false)
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

  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setTab('menu')}
          style={{ fontWeight: tab === 'menu' ? 'bold' : 'normal', padding: '0.5rem 1rem' }}
        >
          Menu Items
        </button>
        <button
          onClick={() => setTab('orders')}
          style={{ fontWeight: tab === 'orders' ? 'bold' : 'normal', padding: '0.5rem 1rem' }}
        >
          Orders
        </button>
      </div>

      {tab === 'menu' && (
        <div>
          <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
            {showAddForm ? 'Cancel' : '+ Add Item'}
          </button>

          {showAddForm && (
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: 4 }}>
              <h3 style={{ marginTop: 0 }}>New Menu Item</h3>
              {['menu_item_name', 'menu_item_description', 'menu_item_category', 'menu_item_price', 'menu_item_image'].map(field => (
                <div key={field} style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 2 }}>{field}</label>
                  <input
                    value={newItem[field]}
                    onChange={e => setNewItem({ ...newItem, [field]: e.target.value })}
                    style={{ width: '100%', padding: '0.3rem', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <button onClick={addItem} style={{ marginTop: '0.5rem', padding: '0.4rem 1rem' }}>Save</button>
            </div>
          )}

          {menuItems.map(item => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.75rem', borderRadius: 4 }}>
              {editingItem?._id === item._id ? (
                <div>
                  {['menu_item_name', 'menu_item_description', 'menu_item_category', 'menu_item_price', 'menu_item_image'].map(field => (
                    <div key={field} style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: 12, marginBottom: 2 }}>{field}</label>
                      <input
                        value={editingItem[field]}
                        onChange={e => setEditingItem({ ...editingItem, [field]: e.target.value })}
                        style={{ width: '100%', padding: '0.3rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                  <button onClick={() => saveEdit(item._id)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.8rem' }}>Save</button>
                  <button onClick={() => setEditingItem(null)} style={{ padding: '0.3rem 0.8rem' }}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{item.menu_item_name}</strong> — {item.menu_item_category} — ${item.menu_item_price}
                    <p style={{ margin: '0.25rem 0 0', fontSize: 13, color: '#555' }}>{item.menu_item_description}</p>
                  </div>
                  <button onClick={() => setEditingItem({ ...item })} style={{ padding: '0.3rem 0.8rem' }}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map(order => (
            <div key={order._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.75rem', borderRadius: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{order.user?.userName || order.user?.email}</strong>
                  <span style={{ marginLeft: '1rem', fontSize: 12, color: '#777' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                  <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: 13 }}>
                    {order.items.map((i, idx) => (
                      <li key={idx}>{i.name} x{i.quantity} — ${i.price}</li>
                    ))}
                  </ul>
                </div>
                <select
                  value={order.status}
                  onChange={e => changeOrderStatus(order._id, e.target.value)}
                  style={{ padding: '0.3rem' }}
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
