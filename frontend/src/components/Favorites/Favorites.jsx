import { useState, useEffect } from "react";
import "./Favorites.css";
import SearchLocations from "../SearchLocations/SearchLocations";

// Address book inside the Favorites profile tab.
//
// Addresses persist on the logged-in user (User.user_locations) via the
// /api/locations endpoints — same fetch/refetch shape as Todos.jsx. Each entry
// carries its Mongo _id, used as the key for edit/delete.
//
// View state machine:
//   "list" -> empty state OR saved-address list (+ "add" button)
//   "form" -> add/edit form (search + comment)
export default function Favorites() {
  const [addresses, setAddresses] = useState([]); // [{ _id, address, comment }]
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null); // null = adding new

  // Load the saved list on mount. Mutations below return the fresh list, so we
  // only need this initial fetch.
  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const res = await fetch("/api/locations");
    if (!res.ok) return; // 401 etc. — modal only opens when logged in.
    const data = await res.json();
    setAddresses(data.locations || []);
  }

  const openAdd = () => {
    setEditingId(null);
    setView("form");
  };

  const openEdit = (id) => {
    setEditingId(id);
    setView("form");
  };

  const cancel = () => {
    setEditingId(null);
    setView("list");
  };

  // Save = add new (no editingId) or update the matching entry. Both endpoints
  // return the updated list, which we drop straight into state.
  const save = async ({ address, comment }) => {
    const res = editingId
      ? await fetch("/api/locations/updateLocation", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, address, comment }),
        })
      : await fetch("/api/locations/addLocation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, comment }),
        });
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.locations || []);
    }
    cancel();
  };

  const remove = async (id) => {
    const res = await fetch("/api/locations/deleteLocation", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.locations || []);
    }
    cancel();
  };

  if (view === "form") {
    const editing = addresses.find((a) => a._id === editingId) || null;
    return (
      <AddressForm
        initial={editing}
        onSave={save}
        onCancel={cancel}
        onDelete={editing ? () => remove(editing._id) : null}
      />
    );
  }

  // view === "list"
  return (
    <div className="fav">
      {addresses.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <>
          <span className="fav-section-label">Adrese salvate</span>
          <div className="fav-list">
            {addresses.map((a) => (
              <AddressCard key={a._id} entry={a} onOpen={() => openEdit(a._id)} />
            ))}
          </div>
          <AddButton onClick={openAdd} />
        </>
      )}
    </div>
  );
}

// Centered icon + message shown when nothing is saved yet.
function EmptyState({ onAdd }) {
  return (
    <div className="fav-empty">
      <PinIcon className="fav-empty-icon" size={48} />
      <p className="fav-empty-text">Nu ați adăugat încă nici o adresă.</p>
      <AddButton onClick={onAdd} />
    </div>
  );
}

// One saved address row: pin, address line, comment subline, chevron to edit.
function AddressCard({ entry, onOpen }) {
  return (
    <button type="button" className="fav-card" onClick={onOpen}>
      <PinIcon className="fav-card-pin" size={20} />
      <span className="fav-card-text">
        <span className="fav-card-address">{entry.address}</span>
        {entry.comment ? (
          <span className="fav-card-comment">{entry.comment}</span>
        ) : null}
      </span>
      <span className="fav-card-chevron">›</span>
    </button>
  );
}

// Add / edit form. Holds its own draft so typing doesn't churn the parent list.
function AddressForm({ initial, onSave, onCancel, onDelete }) {
  const [address, setAddress] = useState(initial?.address || "");
  const [comment, setComment] = useState(initial?.comment || "");

  const canSave = address.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ address: address.trim(), comment: comment.trim() });
  };

  return (
    <form className="fav-form" onSubmit={handleSubmit}>
      <label className="fav-field-label">
        Denumirea străzii și numărul clădirii
      </label>
      <SearchLocations
        value={address}
        onChange={setAddress}
        onSelect={setAddress}
        onClear={() => setAddress("")}
      />

      <label className="fav-field-label">Comentariu privind adresa</label>
      <textarea
        className="fav-comment"
        placeholder="Număr apartament și detalii pentru livrare"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />

      <div className="fav-form-actions">
        <button type="button" className="fav-btn-ghost" onClick={onCancel}>
          Anulează
        </button>
        {onDelete ? (
          <button type="button" className="fav-btn-danger" onClick={onDelete}>
            Șterge
          </button>
        ) : null}
        <button type="submit" className="fav-btn-primary" disabled={!canSave}>
          {initial ? "Salvează" : "Adaugă"}
        </button>
      </div>
    </form>
  );
}

// Shared orange call-to-action.
function AddButton({ onClick }) {
  return (
    <button type="button" className="fav-add-btn" onClick={onClick}>
      <span className="fav-add-plus">⊕</span> Adaugă o adresă nouă
    </button>
  );
}

// Simple location-pin glyph, reused at a few sizes.
function PinIcon({ className, size = 24 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}
