import "hamburgers/dist/hamburgers.css";

export default function Hamburger({ isActive, onClick }) {
  return (
    <button
      className={`hamburger hamburger--spring ${isActive ? "is-active" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className="hamburger-box">
        <span className="hamburger-inner"></span>
      </span>
    </button>
  );
}
