import { useState, useEffect } from 'react'

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    fetch('/api/menuitems')
      .then(res => res.json())
      .then(data => setMenuItems(data.menuItems))
  }, [])

  return (
    <ul>
      {menuItems.map(item => (
        <li key={item._id}>
          {item.menu_item_name} — ${item.menu_item_price}
        </li>
      ))}
    </ul>
  )
}
