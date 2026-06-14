import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import GoogleSignInButton from "../../GoogleSignInButton/GoogleSignInButton";
import "./signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const { user, refreshUser } = useUser();
  console.log("user from context:", user);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.errors) {
      setErrors(data.errors);
    } else {
      await refreshUser();
      navigate("/");
    }
  }

  return (
    <div className="signup-form-wrapper">
      <div>
        <GoogleSignInButton />
      </div>
      {errors.map((err, i) => (
        <div key={i} className="alert alert-danger">
          {err.msg}
        </div>
      ))}
      <form className="inputs-wrapper" onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          placeholder="User Name"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
