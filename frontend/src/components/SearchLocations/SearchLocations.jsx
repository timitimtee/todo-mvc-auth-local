import React, { useRef, useCallback } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

// Places library powers the address autocomplete. Defined at module scope so
// the array keeps a stable reference — otherwise useJsApiLoader warns/reloads
// on every render.
const LIBRARIES = ["places"];

// Address-search box. Reports the picked address up via `onSelect(address)`.
// No map: this POC only needs "type -> pick -> hand the string to the parent".
function SearchLocations({ onSelect }) {
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

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        placeholder="Search for an address…"
        style={{ width: "100%", padding: "8px 10px", boxSizing: "border-box" }}
      />
    </Autocomplete>
  );
}

export default React.memo(SearchLocations);
