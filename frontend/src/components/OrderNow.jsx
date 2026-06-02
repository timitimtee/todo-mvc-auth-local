import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Button() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/ordernow");
  }

  return <button className="orderNow-btn" onClick={handleClick}>Order Now</button>;
}

export default Button;
