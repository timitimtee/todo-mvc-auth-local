import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInButton.css";
// import SignupModal from "../../SignupModal/SignupModal";

export default function SignInButton() {
  const navigate = useNavigate();

  function handleClick(e) {
    navigate("/signup");
  }

  return (
    <>
      <a className="sign-in-button" onClick={handleClick}>
        Sign In
      </a>
    </>
  );
}
