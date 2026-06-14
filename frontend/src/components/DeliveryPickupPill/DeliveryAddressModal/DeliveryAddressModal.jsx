import { useState, useEffect } from "react";
import "./DeliveryAddressModal.css";
import SearchLocations from "../../SearchLocations/SearchLocations";
import GoogleSignInButton from "../../GoogleSignInButton/GoogleSignInButton";
import { useUser } from "../../../hooks/useUser";

/**
 * Delivery address modal. Same shell/design as OrderTimingModal (center modal
 * + dim overlay + fade), but the body is an address picker.
 *
 * Controlled by the parent:
 *  - isOpen    : show/hide
 *  - onClose   : called when the modal finishes closing
 *  - onConfirm : called with the chosen { address, comment } when the user
 *                confirms / picks a saved address
 *
 * Two views:
 *  - "browse"  : search box on top. Logged in -> list of saved addresses
 *                (from /api/locations). Logged out -> sign-in prompt.
 *  - "confirm" : after picking a new address from search — shows the address,
 *                an "Additional details" field (maps to our single comment),
 *                and Confirm / Cancel.
 *
 * Persistence: logged in -> POST /api/locations (so it also lands in profile
 * Favorites). Logged out -> the parent stores the active address in
 * localStorage; this modal just hands it up via onConfirm.
 */
export default function DeliveryAddressModal({ isOpen, onClose, onConfirm }) {
  const { user } = useUser();
  const [closing, setClosing] = useState(false);
  const [view, setView] = useState("browse");
  const [searchText, setSearchText] = useState("");
  const [picked, setPicked] = useState({ address: "", comment: "" });
  const [saved, setSaved] = useState([]);

  // When logged in, load the saved addresses each time the modal opens.
  useEffect(() => {
    if (!isOpen || !user) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/locations");
      if (!res.ok || cancelled) return;
      const data = await res.json();
      setSaved(data.locations || []);
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, user]);

  // Fade out (matches CSS duration) then unmount + reset to the browse view.
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setView("browse");
      setSearchText("");
      setPicked({ address: "", comment: "" });
      onClose();
    }, 250);
  };

  // User picked a suggestion from the autocomplete -> go confirm its details.
  const handleSelectFromSearch = (address) => {
    setPicked({ address, comment: "" });
    setView("confirm");
  };

  // Tapped an existing saved address -> select it straight away.
  const handlePickSaved = (entry) => {
    onConfirm({ address: entry.address, comment: entry.comment || "" });
    handleClose();
  };

  // Confirm the new address. Persist to the DB when logged in; either way hand
  // the active address up to the parent.
  const handleConfirm = async () => {
    if (!picked.address) return;
    if (user) {
      await fetch("/api/locations/addLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: picked.address, comment: picked.comment }),
      });
    }
    onConfirm({ address: picked.address, comment: picked.comment });
    handleClose();
  };

  // Don't render while fully closed (no invisible overlay eating clicks).
  if (!isOpen && !closing) return null;

  const title = view === "confirm" ? "Confirm address" : "Delivery address";

  return (
    <div
      className={`da-overlay ${isOpen && !closing ? "open" : ""} ${
        closing ? "closing" : ""
      }`}
      onClick={handleClose}
    >
      <div className="da-modal" onClick={(e) => e.stopPropagation()}>
        <div className="da-header">
          {view === "confirm" ? (
            <button
              className="da-icon-btn da-back"
              aria-label="Back"
              onClick={() => setView("browse")}
            >
              ←
            </button>
          ) : (
            <span className="da-header-spacer" />
          )}
          <span className="da-title">{title}</span>
          <button
            className="da-icon-btn da-close"
            aria-label="Close"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        {view === "browse" ? (
          <div className="da-body">
            <SearchLocations
              value={searchText}
              onChange={setSearchText}
              onSelect={handleSelectFromSearch}
              onClear={() => setSearchText("")}
            />

            {user ? (
              <div className="da-saved-list">
                {saved.map((entry) => (
                  <button
                    key={entry._id}
                    type="button"
                    className="da-saved-card"
                    onClick={() => handlePickSaved(entry)}
                  >
                    <PinIcon className="da-saved-pin" size={20} />
                    <span className="da-saved-text">
                      <span className="da-saved-address">{entry.address}</span>
                      {entry.comment ? (
                        <span className="da-saved-comment">{entry.comment}</span>
                      ) : null}
                    </span>
                    <span className="da-saved-chevron">›</span>
                  </button>
                ))}
              </div>
            ) : (
              <SignedOutPrompt />
            )}
          </div>
        ) : (
          <div className="da-body">
            <div className="da-confirm-address">
              <span className="da-confirm-address-text">{picked.address}</span>
              <button
                className="da-icon-btn"
                aria-label="Edit address"
                onClick={() => setView("browse")}
              >
                <PencilIcon />
              </button>
            </div>

            <label className="da-field-label" htmlFor="da-details">
              Additional details
            </label>
            <input
              id="da-details"
              className="da-input"
              type="text"
              placeholder="Apartment, unit, suite, etc (Optional)"
              value={picked.comment}
              onChange={(e) =>
                setPicked((p) => ({ ...p, comment: e.target.value }))
              }
            />

            <div className="da-footer">
              <button className="da-confirm-btn" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="da-cancel-btn" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Logged-out empty state (Image #7). Sign-in button is a placeholder for now.
function SignedOutPrompt() {
  return (
    <div className="da-signedout">
      <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="da-signedout-title">Want faster checkout?</p>
      <p className="da-signedout-text">
        Sign in to use saved addresses and get accurate delivery estimates.
      </p>
      <div className="da-signin-wrap">
        <GoogleSignInButton />
      </div>
    </div>
  );
}

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

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}
