import { useCart } from "../../hooks/useCart";
import "./ViewOrderButton.css";

// Floating pill pinned to the bottom of the menu. Only shows when the cart has
// something in it; clicking opens the cart drawer.
export default function ViewOrderButton() {
  const { count, total, openDrawer } = useCart();

  if (count === 0) return null;

  return (
    <button className="view-order-btn" onClick={openDrawer}>
      <span className="view-order-label">
        View order — ${total.toFixed(2)}
      </span>
      <span className="view-order-count">
        <span className="view-order-bag">🛍</span>
        {count}
      </span>
    </button>
  );
}
