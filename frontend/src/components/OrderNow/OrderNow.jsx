import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OrderNow.css";

function Button() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/ordernow");
  }

  return (
    <button className="orderNow-btn" onClick={handleClick}>
      ORDER NOW
    </button>
  );
}

export default Button;
