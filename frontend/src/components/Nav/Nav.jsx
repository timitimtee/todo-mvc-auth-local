import { useState } from "react";
import "./Nav.css";
import NavLink from "../NavLink";
import Hamburger from "../Hamburger/Hamburger";
import Logo from "../Logo/Logo";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav">
      <Logo />
      <div className="nav-links">
        <NavLink to="/menu" label="Menu" />
        <NavLink to="/about" label="About Us" />
        <NavLink to="/contact" label="Contact" />
      </div>
      <div className="nav-hamburger">
        <Hamburger isActive={isOpen} onClick={() => setIsOpen((o) => !o)} />
      </div>
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <NavLink to="/menu" label="Menu" />
        <NavLink to="/about" label="About Us" />
        <NavLink to="/contact" label="Contact" />
      </div>
    </nav>
  );
}
