import { useState } from "react";
import "./CartDrawer.css";
import scooterIcon from "../DeliveryPickupPill/icons8-scooter-100.png";

export default function CartDrawer({ isOpen, onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 350);
  };

  return (
    <div className={`cart-drawer ${isOpen && !closing ? "open" : ""} ${closing ? "closing" : ""}`}>
      <div className="cart-drawer-header">
        <div className="cart-header-title">
          <img src={scooterIcon} alt="delivery" />
          <span>Your Delivery Order</span>
        </div>
        <div className="cart-header-close">
          <button className="cart-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
      <div className="cart-drawer-body">
        <p>Add items to start your order.</p>
      </div>
    </div>
  );
}
