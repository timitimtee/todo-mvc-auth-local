import { useNavigate } from "react-router-dom";
import "./SignInButton.css";
import { useUser } from "../../../hooks/useUser";
import profileIcon from "./icons8-profile-96.png";

export default function SignInButton() {
  const navigate = useNavigate();
  const { user } = useUser();

  function handleClick(e) {
    navigate("/signup");
  }

  return (
    <>
      {user ? (
        <img src={profileIcon} alt="profile" />
      ) : (
        <a className="sign-in-button" onClick={handleClick}>
          Sign In
        </a>
      )}
    </>
  );
}
