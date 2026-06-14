import { useState, useEffect } from "react";
import "./OrderTimingModal.css";

// timing modes — exported so the parent uses the same strings, no typos
export const ASAP = "asap";
export const SCHEDULED = "scheduled";

/**
 * Order timing modal (center modal + dim overlay).
 *
 * Controlled by the parent:
 *  - isOpen     : show/hide
 *  - value      : { mode, date, time } currently committed in the parent
 *  - onConfirm  : called with the new { mode, date, time } when user hits Confirm
 *  - onClose    : called when the modal finishes closing (Cancel / overlay / X)
 *  - dateOptions / timeOptions : string arrays for the two <select> menus
 *
 * The modal keeps its own *draft* copy of the selection so that hitting Cancel
 * throws the edits away. The draft is re-seeded from `value` every time the
 * modal opens.
 */
export default function OrderTimingModal({
  isOpen,
  onClose,
  onConfirm,
  value,
  dateOptions,
  timeOptions,
  title,
}) {
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState(value.mode);
  const [date, setDate] = useState(value.date);
  const [time, setTime] = useState(value.time);

  // re-seed the draft from the committed value each time we open
  useEffect(() => {
    if (isOpen) {
      setMode(value.mode);
      setDate(value.date);
      setTime(value.time);
    }
    // only run on open transition; value is read fresh inside
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    // matches the CSS fade duration before we actually unmount
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };

  const handleConfirm = () => {
    onConfirm({ mode, date, time });
    handleClose();
  };

  // don't render anything while fully closed (no invisible overlay eating clicks)
  if (!isOpen && !closing) return null;

  return (
    <div
      className={`timing-overlay ${isOpen && !closing ? "open" : ""} ${
        closing ? "closing" : ""
      }`}
      onClick={handleClose}
    >
      {/* stopPropagation so clicks inside the box don't bubble to the overlay-close */}
      <div className="timing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="timing-header">
          <span>{title}</span>
        </div>

        <div className="timing-body">
          <label
            className={`timing-option ${mode === ASAP ? "selected" : ""}`}
          >
            <span className="timing-option-label">ASAP</span>
            <input
              type="radio"
              name="timing-mode"
              checked={mode === ASAP}
              onChange={() => setMode(ASAP)}
            />
          </label>

          <label
            className={`timing-option ${mode === SCHEDULED ? "selected" : ""}`}
          >
            <span className="timing-option-label">Schedule for later</span>
            <input
              type="radio"
              name="timing-mode"
              checked={mode === SCHEDULED}
              onChange={() => setMode(SCHEDULED)}
            />
          </label>

          {mode === SCHEDULED && (
            <div className="timing-schedule">
              <label className="timing-field-label" htmlFor="timing-date">
                Date
              </label>
              <select
                id="timing-date"
                className="timing-select"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              >
                {dateOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <label className="timing-field-label" htmlFor="timing-time">
                Time
              </label>
              <select
                id="timing-time"
                className="timing-select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                {timeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="timing-footer">
          <button className="timing-confirm" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="timing-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
