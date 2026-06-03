import Button from "../OrderNow";

export default function Homepage() {
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">Vegety</div>
        <div className="nav-actions">
          {/* <span>&#9906;</span>*/}
          <span>&#9776;</span>
          <Button />
        </div>
      </nav>

      <section className="header">
        <div className="header-text">
          <h1>Lorem ipsum dolor sit amet consectetur adipiscing</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.
          </p>
          <button className="header-btn">Get Started</button>
        </div>
        <div className="header-image">
          <div className="img-placeholder hero-img"></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Our Special Dish</h2>
          <p className="section-sub">Lorem ipsum dolor sit amet consectetur.</p>
          <div className="gallery">
            {["Green Salad", "Beef Salad", "Nut Salad"].map((dish) => (
              <div key={dish} className="card">
                <div className="img-placeholder card-img"></div>
                <h3>{dish}</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
                  eiusmod tempor incididunt.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>Lorem ipsum dolor sit amet &copy; 2024</p>
        </div>
      </footer>
    </>
  );
}
