// Hardcoded placeholder extras shown for EVERY item in the ItemModal for now.
// TODO(backend): make these per-item and admin-managed (e.g. a menu_item_extras
// array on the MenuItem model, edited in Manage.jsx) instead of one shared list.
export const EXTRAS = [
  { name: "Guacamole", price: 1.5 },
  { name: "Cheese", price: 0.99 },
  { name: "Sour Cream", price: 0.99 },
  { name: "Jalapeños", price: 0.75 },
];

// Sales tax rate used to show the Tax line in the cart drawer.
// TODO(backend): this should come from an admin/settings value, not be hardcoded
// (same pattern as ASAP_MINUTES in OrderTimingModal).
export const TAX_RATE = 0.065;
