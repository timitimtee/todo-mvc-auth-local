// src/components/SignupModal/SignupModal.jsx
import { useEffect } from "react";
import "./SignupModal.css";

export default function SignupModal({ isOpen, originX, originY, onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="signup-modal"
      style={{
        "--origin-x": `${originX}%`,
        "--origin-y": `${originY}%`,
      }}
    >
      <div className="signup-modal__content">
        <h2>Welcome to Biofresh</h2>
        <p>Sign in to track your orders and save your favourites.</p>
        <a href="/auth/google" className="signup-modal__btn">
          Continue with Google
        </a>
        <p className="signup-modal__hint">Use the menu icon to close</p>
      </div>
    </div>
  );
}
