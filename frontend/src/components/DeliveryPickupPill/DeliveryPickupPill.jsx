import { useState, useEffect } from "react";
import "./DeliveryPickupPill.css";
import OrderTimingModal, { ASAP } from "./OrderTimingModal/OrderTimingModal";
import DeliveryAddressModal from "./DeliveryAddressModal/DeliveryAddressModal";
import { useUser } from "../../hooks/useUser";
import scooterIcon from "./icons8-scooter-100.png";
import bagIcon from "./icons8-shopping-bag-100.png";
import locationIcon from "./icons8-location-100.png";
import timeIcon from "./icons8-delivery-time-50.png";

// TODO(backend): admin dashboard will own these values later.
const ASAP_MINUTES = 50; // flat ASAP estimate for both delivery & pickup

// Date menu: Today, Tomorrow, then a few upcoming days.
// Built once at module load — fine for a single session.
const DATE_OPTIONS = (() => {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (i === 0) out.push("Today");
    else if (i === 1) out.push("Tomorrow");
    else
      out.push(
        d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
  }
  return out;
})();

// Time menu: 9:00 AM through 9:00 PM in 30-min steps.
const TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 9; h <= 21; h++) {
    for (const m of [0, 30]) {
      if (h === 21 && m === 30) break; // stop at 9:00 PM
      const ampm = h < 12 ? "AM" : "PM";
      const hr = h % 12 === 0 ? 12 : h % 12;
      out.push(`${hr}:${m === 0 ? "00" : "30"} ${ampm}`);
    }
  }
  return out;
})();

// Build the time-container text from the current order type + timing choice.
function buildTimingText(orderType, timing) {
  if (timing.mode === ASAP) {
    return orderType === "delivery"
      ? `ASAP • Estimated in ~${ASAP_MINUTES} min`
      : `Pickup in ~${ASAP_MINUTES} min`;
  }
  // scheduled — "today"/"tomorrow" read better lowercased; real dates keep case
  const when =
    timing.date === "Today" || timing.date === "Tomorrow"
      ? timing.date.toLowerCase()
      : timing.date;
  return orderType === "delivery"
    ? `Estimated ${when} at ${timing.time}`
    : `Pickup ${when} at ${timing.time}`;
}

// localStorage key for the active delivery address when logged out.
const DELIVERY_ADDR_KEY = "deliveryAddress";

// Pickup is a single fixed store location — hardcoded text + its Google Maps
// link (opened in a new tab when the row is clicked in pickup mode).
const PICKUP_LOCATION_TEXT = "Pickup at Strada Francesco Griselini 2, Timișoara";
const PICKUP_MAPS_URL =
  "https://www.google.com/maps/place//data=!4m2!3m1!1s0x4745678025a4a945:0x8a7ea0a1c5b61adb?sa=X&ved=1t:8290&ictx=111";

// "Delivery to <address>, <comment>" — the active-address row text (Image #10).
function buildDeliveryText(addr) {
  if (!addr || !addr.address) return "Confirm you're in delivery range";
  return `Delivery to ${addr.address}${addr.comment ? `, ${addr.comment}` : ""}`;
}

function DeliveryPickupPill() {
  const { user } = useUser();
  const [selected, setSelected] = useState("delivery"); // "delivery" | "pickup"
  const [modalOpen, setModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  // Active delivery address shown in the location row. { address, comment } | null.
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [timing, setTiming] = useState({
    mode: ASAP,
    date: "Today",
    time: "6:30 PM",
  });

  // Load the active address on mount / when auth changes.
  // Logged in: first saved address from the DB. Logged out: localStorage.
  useEffect(() => {
    if (user) {
      let cancelled = false;
      (async () => {
        const res = await fetch("/api/locations");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (data.locations && data.locations.length > 0) {
          setDeliveryAddress(data.locations[0]);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    // logged out -> read the persisted address from localStorage
    const stored = localStorage.getItem(DELIVERY_ADDR_KEY);
    if (stored) setDeliveryAddress(JSON.parse(stored));
  }, [user]);

  // Called when the modal confirms an address. Persist to localStorage when
  // logged out (the modal already POSTed to the DB when logged in).
  const handleAddressConfirm = (entry) => {
    setDeliveryAddress(entry);
    if (!user) localStorage.setItem(DELIVERY_ADDR_KEY, JSON.stringify(entry));
  };

  return (
    <div className="delivery-pickup-wrapper">
      <div className="pill-container">
        <div
          className={`pill-option ${selected === "delivery" ? "active" : ""}`}
          onClick={() => setSelected("delivery")}
        >
          <img src={scooterIcon} alt="delivery" />
          <span>Delivery</span>
        </div>
        <div
          className={`pill-option ${selected === "pickup" ? "active" : ""}`}
          onClick={() => setSelected("pickup")}
        >
          <img src={bagIcon} alt="pickup" />
          <span>Pickup</span>
        </div>
      </div>

      <div
        className="location-container selection-row"
        onClick={() =>
          selected === "pickup"
            ? window.open(PICKUP_MAPS_URL, "_blank", "noopener,noreferrer")
            : setAddressModalOpen(true)
        }
      >
        <img src={locationIcon} alt="location" />
        <span>
          {selected === "pickup"
            ? PICKUP_LOCATION_TEXT
            : buildDeliveryText(deliveryAddress)}
        </span>
        <span className="arrow">&#62;</span>
      </div>

      <div
        className="time-container selection-row"
        onClick={() => setModalOpen(true)}
      >
        <img src={timeIcon} alt="delivery time" />
        <span>{buildTimingText(selected, timing)}</span>
        <span className="arrow">&#62;</span>
      </div>

      <OrderTimingModal
        isOpen={modalOpen}
        title={selected === "delivery" ? "Delivery time" : "Pickup time"}
        value={timing}
        dateOptions={DATE_OPTIONS}
        timeOptions={TIME_OPTIONS}
        onConfirm={setTiming}
        onClose={() => setModalOpen(false)}
      />

      <DeliveryAddressModal
        isOpen={addressModalOpen}
        onConfirm={handleAddressConfirm}
        onClose={() => setAddressModalOpen(false)}
      />
    </div>
  );
}

export default DeliveryPickupPill;
