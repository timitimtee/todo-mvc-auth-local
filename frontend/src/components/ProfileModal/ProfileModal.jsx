import { useState, useEffect } from "react";
import "./ProfileModal.css";
import { useUser } from "../../hooks/useUser";

// Sections shown in the left nav rail. `key` drives which panel renders,
// `label` is what the user sees. Add a section here = one new entry + one panel.
const SECTIONS = [
  { key: "account", label: "Account" },
  { key: "orders", label: "Orders" },
  { key: "favorites", label: "Favorites" },
];

export default function ProfileModal({ isOpen, onClose }) {
  const { user, logout } = useUser();
  const [closing, setClosing] = useState(false);
  // Which section is showing in the right pane. Master-detail nav:
  // the left rail never disappears, so there is no "back button" problem.
  const [active, setActive] = useState("account");

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 350);
  };

  // Log out via UserContext, then close. After logout `user` becomes null,
  // so SignInButton swaps the profile icon back to "Sign In" on its own.
  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  // Close on Escape key — standard modal behaviour, keeps it feeling smooth.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Don't render the full-screen backdrop while closed — otherwise its
  // overlay would invisibly cover the page and swallow clicks.
  if (!isOpen && !closing) return null;

  return (
    <div
      className={`profile-overlay ${closing ? "closing" : ""}`}
      onClick={handleClose}
    >
      {/* stopPropagation so clicks inside the modal don't bubble to the
          backdrop (which would close it). */}
      <div
        className={`profile-modal ${closing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-header">
          <span className="profile-title">My Profile</span>
          <button className="profile-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="profile-body">
          <nav className="profile-sidebar">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                className={`profile-nav-item ${active === s.key ? "active" : ""}`}
                onClick={() => setActive(s.key)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="profile-content">
            {active === "account" && (
              <AccountPanel user={user} onLogout={handleLogout} />
            )}
            {active === "orders" && <OrdersPanel />}
            {active === "favorites" && <FavoritesPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountPanel({ user, onLogout }) {
  // Only the fields the backend actually whitelists exist on `user`
  // (see controllers/auth.js getMe). Phone + full name are NOT in the
  // model yet, so they show as "Not added yet" instead of faking data.
  const name = user?.displayName || user?.firstName || user?.userName || "—";

  return (
    <div className="panel">
      <Field label="Name" value={name} />
      <Field label="Email" value={user?.email} />
      <Field label="Phone" value={null} />
      <button className="profile-logout" onClick={onLogout}>
        Log out
      </button>
    </div>
  );
}

function OrdersPanel() {
  return (
    <div className="panel">
      <p className="panel-empty">No orders yet.</p>
    </div>
  );
}

function FavoritesPanel() {
  return (
    <div className="panel">
      <p className="panel-empty">No saved locations yet.</p>
    </div>
  );
}

// One labelled row. Falls back to a muted "Not added yet" when empty.
function Field({ label, value }) {
  return (
    <div className="profile-field">
      <span className="field-label">{label}</span>
      <span className={`field-value ${value ? "" : "field-empty"}`}>
        {value || "Not added yet"}
      </span>
    </div>
  );
}
