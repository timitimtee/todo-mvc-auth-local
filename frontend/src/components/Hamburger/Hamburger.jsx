// Pure SCSS path: hamburger.scss compiles base + the `spring` type itself.
// Do NOT also import dist/hamburgers.css — it's pre-baked at default sizes
// and would override our customizations.
import "./hamburger.scss";

export default function Hamburger({ isActive, onClick }) {
  return (
    <button
      className={`hamburger-custom hamburger hamburger--spring ${isActive ? "is-active" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className="hamburger-box">
        <span className="hamburger-inner"></span>
      </span>
    </button>
  );
}
