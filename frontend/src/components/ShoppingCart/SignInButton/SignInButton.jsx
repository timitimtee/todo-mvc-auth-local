import { useState } from "react";
import "./SignInButton.css";
import SignupModal from "../../SignupModal/SignupModal";

export default function SignInButton() {
  const [open, setOpen] = useState(false);
  const [originX, setOriginX] = useState(50);
  const [originY, setOriginY] = useState(50);

  function handleClick(e) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setOriginX(x);
    setOriginY(y);
    setOpen(true);
  }

  return (
    <>
      <a className="sign-in-button" onClick={handleClick}>
        Sign In
      </a>

      <SignupModal
        isOpen={open}
        originX={originX}
        originY={originY}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
