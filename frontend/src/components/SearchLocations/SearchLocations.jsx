import React, { useRef, useCallback } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

// Places library powers the address autocomplete. Defined at module scope so
// the array keeps a stable reference — otherwise useJsApiLoader warns/reloads
// on every render.
const LIBRARIES = ["places"];

// Controlled address-search box.
// Parent owns the text via `value` / `onChange`. When the user picks a
// suggestion we hand the full formatted address up via `onSelect`. A red ✕
// (shown once there is text) clears the box via `onClear`.
function SearchLocations({ value, onChange, onSelect, onClear }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // Vite exposes only VITE_-prefixed vars to the browser, via import.meta.env
    // (NOT process.env). Set VITE_GOOGLEMAPS_API_KEY in frontend/.env.
    googleMapsApiKey: import.meta.env.VITE_GOOGLEMAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Hold the Autocomplete instance so onPlaceChanged can read the chosen place.
  const autocompleteRef = useRef(null);

  const onLoad = useCallback((ac) => {
    autocompleteRef.current = ac;
  }, []);

  const onPlaceChanged = useCallback(() => {
    const ac = autocompleteRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    // formatted_address = the human-readable line; fall back to name.
    const address = place?.formatted_address || place?.name;
    if (address) onSelect?.(address);
  }, [onSelect]);

  // Script not ready yet (or key missing) -> render nothing.
  if (!isLoaded) return null;

  const hasText = Boolean(value);

  return (
    <div className="search-locations">
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          className="search-locations-input"
          placeholder="Introdu adresa"
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </Autocomplete>

      {hasText ? (
        // Clear button — only once something is typed/selected.
        <button
          type="button"
          className="search-locations-clear"
          aria-label="Clear address"
          onClick={() => onClear?.()}
        >
          ✕
        </button>
      ) : (
        // Magnifying-glass affordance while the box is empty.
        <svg
          className="search-locations-icon"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export default React.memo(SearchLocations);
