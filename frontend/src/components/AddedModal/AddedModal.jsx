import { useCart } from "../../hooks/useCart";
import "./AddedModal.css";

// Simple confirmation that pops up on the menu page right after "Add to Cart".
// Driven by CartContext.lastAddCount (0 = hidden). Bottom-sheet style.
export default function AddedModal() {
  const { lastAddCount, clearLastAdded, openDrawer } = useCart();

  if (lastAddCount <= 0) return null;

  function viewCart() {
    clearLastAdded();
    openDrawer();
  }

  return (
    <div className="added-modal-overlay" onClick={clearLastAdded}>
      <div className="added-modal" onClick={(e) => e.stopPropagation()}>
        <p className="added-modal-title">
          <span className="added-modal-check">✓</span>
          {lastAddCount} item(s) added to your cart
        </p>
        <button className="added-modal-viewcart" onClick={viewCart}>
          View cart
        </button>
        <button className="added-modal-back" onClick={clearLastAdded}>
          Back to menu
        </button>
      </div>
    </div>
  );
}
