import { useState } from "react";
import "./CartDrawer.css";
import scooterIcon from "../../DeliveryPickupPill/icons8-scooter-100.png";
import { useCart } from "../../../hooks/useCart";

// Reads open state + items straight from CartContext, so the Nav cart icon, the
// floating "View order" button, and the "added" modal can all open it.
export default function CartDrawer() {
  const {
    items,
    subtotal,
    tax,
    total,
    unitPrice,
    incrementLine,
    removeLine,
    drawerOpen,
    closeDrawer,
  } = useCart();
  const [closing, setClosing] = useState(false);

  // Play the slide-out animation, THEN flip the context flag off.
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      closeDrawer();
    }, 350);
  };

  return (
    <div
      className={`cart-drawer ${drawerOpen && !closing ? "open" : ""} ${closing ? "closing" : ""}`}
    >
      <div className="cart-drawer-header">
        <div className="cart-header-title">
          <img src={scooterIcon} alt="delivery" />
          <span>Your Order</span>
        </div>
        <div className="cart-header-close">
          <button className="cart-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="cart-drawer-body">
          <p>Add items to start your order.</p>
        </div>
      ) : (
        <>
          <div className="cart-drawer-items">
            {items.map((line) => (
              <div className="cart-line" key={line.lineId}>
                <img
                  className="cart-line-img"
                  src={line.image}
                  alt={line.name}
                />
                <div className="cart-line-info">
                  <span className="cart-line-name">{line.name}</span>
                  {line.extras.length > 0 && (
                    <span className="cart-line-extras">
                      {line.extras
                        .map(
                          (e) => `${e.name}${e.qty > 1 ? ` (${e.qty})` : ""}`,
                        )
                        .join(", ")}
                    </span>
                  )}
                  <span className="cart-line-price">
                    ${(unitPrice(line) * line.qty).toFixed(2)}
                  </span>
                </div>
                <div className="cart-line-controls">
                  <button
                    className="cart-line-trash"
                    onClick={() => removeLine(line.lineId)}
                    aria-label="Remove item"
                  >
                    🗑
                  </button>
                  <span className="cart-line-qty">{line.qty}</span>
                  <button
                    className="cart-line-add"
                    onClick={() => incrementLine(line.lineId)}
                    aria-label="Add one more"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {/* TODO: real checkout flow (saves the order) — separate task. */}
            <button className="cart-checkout-btn" onClick={() => {}}>
              <span>Checkout</span>
              <span>${total.toFixed(2)}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
