import { useState, useEffect, useRef } from "react";
import "./MenuItems.css";

export default function MenuItems({ onAddItem }) {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    fetch("/api/menuitems")
      .then((res) => res.json())
      .then((data) => setMenuItems(data.menuItems));
  }, []);

  const grouped = menuItems.reduce((acc, item) => {
    const cat = item.menu_item_category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

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

  function scrollCarousel(dir) {
    carouselRef.current.scrollLeft += dir * 150;
  }

  function jumpToCategory(cat) {
    setActiveCategory(cat);
    const el = document.getElementById(`section-${cat}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <section className="menu-browse">
        <div className="category-row">
          <button className="carousel-arrow" onClick={() => scrollCarousel(-1)}>
            &#8249;
          </button>
          <div
            className="category-carousel"
            ref={carouselRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {categories.map((cat) => (
              <span
                key={cat}
                className={`category-item${activeCategory === cat ? " category-item--active" : ""}`}
                onClick={() => jumpToCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
          <button className="carousel-arrow" onClick={() => scrollCarousel(1)}>
            &#8250;
          </button>
        </div>
      </section>
      <div className="menu-section">
        {categories.map((cat) => (
          <div key={cat} id={`section-${cat}`} className="category-section">
            <h2 className="menu-section-title">{cat}</h2>
            <ul className="menu-list">
              {grouped[cat].map((item) => (
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
                    <button onClick={onAddItem}>Add to cart</button>
                  </div>
                  <div className="menu-item-image-wrapper">
                    <img
                      src={item.menu_item_image}
                      alt="placeholder"
                      className="menu-item-image"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
