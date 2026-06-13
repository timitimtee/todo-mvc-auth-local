import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInButton.css";
import { useUser } from "../../../hooks/useUser";
import profileIcon from "./icons8-profile-96.png";
import ProfileModal from "../../ProfileModal/ProfileModal";

export default function SignInButton() {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);

  function handleClick(e) {
    navigate("/signup");
  }

  // Don't flash the Sign In button while the /api/me check is still running.
  if (loading) return null;

  return (
    <>
      {user ? (
        <img
          src={profileIcon}
          alt="profile"
          style={{ cursor: "pointer" }}
          onClick={() => setProfileOpen(true)}
        />
      ) : (
        <a className="sign-in-button" onClick={handleClick}>
          Sign In
        </a>
      )}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}
