import { useState } from "react";
import "./DeliveryPickupPill.css";
import scooterIcon from "./icons8-scooter-100.png";
import bagIcon from "./icons8-shopping-bag-100.png";
import locationIcon from "./icons8-location-100.png";
import timeIcon from "./icons8-delivery-time-50.png";

function DeliveryPickupPill() {
  const [selected, setSelected] = useState("delivery");

  return (
    <div className="delivery-pickup-wrapper">
      <div className="pill-container">
        <div
          className={`pill-option ${selected === "delivery" ? "active" : ""}`}
          onClick={() => setSelected("delivery")}
        >
          <img src={scooterIcon} alt="delivery" />
          <span>Delivery</span>
        </div>
        <div
          className={`pill-option ${selected === "pickup" ? "active" : ""}`}
          onClick={() => setSelected("pickup")}
        >
          <img src={bagIcon} alt="pickup" />
          <span>Pickup</span>
        </div>
      </div>

      <div className="selection-row">
        <img src={locationIcon} alt="location" />
        <span>Confirm you're in delivery range</span>
        <span className="arrow">&#62;</span>
      </div>

      <div className="selection-row">
        <img src={timeIcon} alt="delivery time" />
        <span>ASAP &bull; Estimated in 30 - 35 min</span>
        <span className="arrow">&#62;</span>
      </div>
    </div>
  );
}

export default DeliveryPickupPill;
