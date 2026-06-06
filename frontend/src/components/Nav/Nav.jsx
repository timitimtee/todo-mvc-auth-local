import { useState } from "react";
import "./Nav.css";
import NavLink from "../NavLink";
import Hamburger from "../Hamburger/Hamburger";
import Logo from "../Logo/Logo";
import logoTitle from "./biofreshLogo-title-fb.jpg";
import ShoppingCart from "../ShoppingCart/ShoppingCart";

export default function Nav({ cartCount }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="left-side-nav-container">
        <div className="nav-hamburger">
          <Hamburger isActive={isOpen} onClick={() => setIsOpen((o) => !o)} />
        </div>
        <div className="logo-title-container">
          <Logo />
          {/* <h1 className="title">Biofresh</h1>*/}
          <img className="logo-title" src={logoTitle}></img>
        </div>
      </div>
      <div className="nav-links">
        <NavLink to="/menu" label="Menu" />
        <NavLink to="/about" label="About Us" />
        <NavLink to="/contact" label="Contact" />
      </div>
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <NavLink to="/menu" label="Menu" />
        <NavLink to="/about" label="About Us" />
        <NavLink to="/contact" label="Contact" />
      </div>
      <ShoppingCart count={cartCount} />
    </nav>
  );
}
