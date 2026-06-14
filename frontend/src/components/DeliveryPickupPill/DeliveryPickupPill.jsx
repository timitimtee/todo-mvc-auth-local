import { useState } from "react";
import "./DeliveryPickupPill.css";
import OrderTimingModal, { ASAP } from "./OrderTimingModal/OrderTimingModal";
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

function DeliveryPickupPill() {
  const [selected, setSelected] = useState("delivery"); // "delivery" | "pickup"
  const [modalOpen, setModalOpen] = useState(false);
  const [timing, setTiming] = useState({
    mode: ASAP,
    date: "Today",
    time: "6:30 PM",
  });

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

      <div className="location-container selection-row">
        <img src={locationIcon} alt="location" />
        <span>Confirm you're in delivery range</span>
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
    </div>
  );
}

export default DeliveryPickupPill;
