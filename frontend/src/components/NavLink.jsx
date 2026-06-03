import React from "react";
import { Link } from "react-router-dom";

function NavLink({ to, label }) {
  return <Link className="nav-link" to={to}>{label}</Link>;
}

export default NavLink;
