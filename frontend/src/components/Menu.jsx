import { useState } from 'react'

export default function Menu() {
  const [orderType, setOrderType] = useState('delivery')
  const [modalOpen, setModalOpen] = useState(false)
  const [timing, setTiming] = useState('asap')

  return (
    <>
      <header className="menu-header">
        <button className="header-hamburger">&#9776;</button>
        <div className="header-logo">
          <div className="logo-placeholder"></div>
        </div>
        <div className="header-actions">
          <button className="cart-btn">
            <span className="cart-icon">&#128722;</span>
            <span className="cart-count">0</span>
          </button>
          <button className="signin-btn">Sign in</button>
        </div>
      </header>

      <section className="menu-hero">
        <img src="/img/hero-food.jpg" alt="Food" className="hero-img" />
      </section>

      <section className="restaurant-info">
        <h1 className="restaurant-name">BioFresh - Downtown</h1>
        <p className="restaurant-address">131 North Orange Avenue, Suite 103, Orlando, FL</p>
        <a href="#" className="change-location">Change location</a>
      </section>

      <div className="order-toggle">
        <button
          className={orderType === 'delivery' ? 'toggle-btn active' : 'toggle-btn'}
          onClick={() => setOrderType('delivery')}
        >
          Delivery
        </button>
        <button
          className={orderType === 'pickup' ? 'toggle-btn active' : 'toggle-btn'}
          onClick={() => setOrderType('pickup')}
        >
          Pickup
        </button>
      </div>

      <div className="order-info">
        <div className="order-info-row">
          <span className="info-icon">&#128205;</span>
          <span className="info-text">Pickup from 131 North Orange Avenue, Suite 103...</span>
          <span className="info-arrow">&#8250;</span>
        </div>
        <div className="order-info-row timing-row" onClick={() => setModalOpen(true)}>
          <span className="info-icon">&#9200;</span>
          <span className="info-text">ASAP &bull; Pickup in 45 min</span>
          <span className="info-arrow">&#8250;</span>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-option">
              <span className="info-icon">&#9200;</span>
              <span>ASAP</span>
              <input type="radio" name="timing" checked={timing === 'asap'} onChange={() => setTiming('asap')} />
            </div>
            <div className="modal-option">
              <span className="info-icon">&#9200;</span>
              <span>Schedule for later</span>
              <input type="radio" name="timing" checked={timing === 'schedule'} onChange={() => setTiming('schedule')} />
            </div>
            {timing === 'schedule' && (
              <div className="schedule-fields">
                <input type="date" className="schedule-input" />
                <input type="time" className="schedule-input" />
              </div>
            )}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="modal-confirm" onClick={() => setModalOpen(false)}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <section className="menu-browse">
        <div className="category-row">
          <span className="category-hamburger">&#9776;</span>
          <div className="category-carousel">
            {['LIMITED TIME OFFERS', 'APPS', 'TACOS', 'DRINKS', 'DESSERTS', 'PASTA'].map((cat) => (
              <span key={cat} className="category-item">{cat}</span>
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

      <footer className="menu-footer">
        <p className="footer-brand">BioFresh &mdash; Location &amp; Hours:</p>
        <p className="footer-address">131 North Orange Avenue, Suite 103, Orlando, FL</p>
        <p className="footer-phone">(407) 000-0000</p>
        <button className="hours-status open">Open Now</button>
        <a href="#" className="order-online-link">Order Online</a>
      </footer>
    </>
  )
}
