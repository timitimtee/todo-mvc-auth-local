import { createContext, useState, useEffect } from "react";
import { TAX_RATE } from "../cart/constants";

export const CartContext = createContext();

const STORAGE_KEY = "cart";

// Build a stable identity for a line from its menu item + chosen extras, so
// adding the exact same item+extras again MERGES into one line (qty++) instead
// of creating a duplicate. Extras are sorted so selection order doesn't matter.
// Different extras -> different signature -> separate line.
function lineSignature(menuItemId, extras) {
  const extrasKey = [...extras]
    .map((e) => `${e.name}:${e.qty}`)
    .sort()
    .join("|");
  return `${menuItemId}__${extrasKey}`;
}

// Price of ONE unit of a line = item price + each extra's price * its own qty.
function unitPrice(line) {
  const extrasTotal = line.extras.reduce((sum, e) => sum + e.price * e.qty, 0);
  return line.price + extrasTotal;
}

// Single source of truth for the cart. Lives entirely client-side
// (state + localStorage) so it works for guests AND logged-in users — login
// only affects saved addresses, not the cart. Order history is saved later,
// at checkout (not implemented yet).
export function CartProvider({ children }) {
  // Lazy initialiser: read localStorage once so a page refresh keeps the cart.
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whether the cart drawer is open. Lifted here so the Nav cart icon AND the
  // floating "View order" button AND the "added" modal can all open it.
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drives the "N item(s) added" confirmation modal on the menu page.
  // 0 = hidden; >0 = how many were just added.
  const [lastAddCount, setLastAddCount] = useState(0);

  // Mirror the cart to localStorage on every change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // line = { menuItemId, name, image, price, extras:[{name,price,qty}] }
  function addItem(line, qty = 1) {
    const id = lineSignature(line.menuItemId, line.extras);
    setItems((prev) => {
      const existing = prev.find((l) => l.lineId === id);
      if (existing) {
        return prev.map((l) =>
          l.lineId === id ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...prev, { ...line, lineId: id, qty }];
    });
    setLastAddCount(qty);
  }

  function incrementLine(lineId) {
    setItems((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, qty: l.qty + 1 } : l)),
    );
  }

  // Matches the reference UI: there is no "minus" — the trash icon removes the
  // whole line regardless of its qty.
  function removeLine(lineId) {
    setItems((prev) => prev.filter((l) => l.lineId !== lineId));
  }

  function openDrawer() {
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
  }
  function clearLastAdded() {
    setLastAddCount(0);
  }

  // Derived totals — recomputed every render, never stored, so they can't drift.
  const count = items.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = items.reduce((sum, l) => sum + unitPrice(l) * l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        tax,
        total,
        unitPrice,
        addItem,
        incrementLine,
        removeLine,
        drawerOpen,
        openDrawer,
        closeDrawer,
        lastAddCount,
        clearLastAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
