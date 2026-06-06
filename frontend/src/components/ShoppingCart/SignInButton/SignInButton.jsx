import "./SignInButton.css";
import { useNavigate } from "react-router-dom";

export default function SignInButton() {
  return (
    <>
      <a href="/auth/google" className="sign-in-button">
        Sign In
      </a>
    </>
  );
}
