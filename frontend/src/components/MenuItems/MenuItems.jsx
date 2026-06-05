import { useState, useEffect, useRef } from "react";
import "./MenuItems.css";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  function onMouseDown(e) {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = "grabbing";
  }

  function onMouseMove(e) {
    if (!isDragging.current) return;
    const delta = e.pageX - startX.current;
    carouselRef.current.scrollLeft = scrollStart.current - delta;
  }

  function stopDrag() {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.style.cursor = "grab";
  }

  useEffect(() => {
    fetch("/api/menuitems")
      .then((res) => res.json())
      .then((data) => setMenuItems(data.menuItems));
  }, []);

  return (
    <>
      <section className="menu-browse">
        <div className="category-row">
          <span className="category-hamburger">&#9776;</span>
          <div
            className="category-carousel"
            ref={carouselRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {["BURGERS", "SOUPS", "DRINKS", "DESSERTS", "PASTA"].map((cat) => (
              <span key={cat} className="category-item">
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div className="search-bar">
          <span className="search-icon">&#128269;</span>
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="featured-section">
          <h2 className="featured-title">Featured Items</h2>
          <div className="items-feed"></div>
        </div>
      </section>
      <div className="menu-section">
        <h2 className="menu-section-title">Menu Items</h2>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item._id} className="menu-item">
              <div className="menu-item-info">
                <h3 className="menu-item-name">{item.menu_item_name}</h3>
                {item.menu_item_description && (
                  <p className="menu-item-description">
                    {item.menu_item_description}
                  </p>
                )}
                <p className="menu-item-price">
                  ${item.menu_item_price.toFixed(2)}
                </p>
              </div>
              <div className="menu-item-image-wrapper">
                <img
                  src={item.menu_item_image}
                  alt={item.menu_item_name}
                  className="menu-item-image"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
