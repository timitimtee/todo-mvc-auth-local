import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import GoogleSignInButton from "../../GoogleSignInButton/GoogleSignInButton";
import Logo from "../../Logo/Logo";
import "./auth.css";

// One card for both local-auth flows. `mode` decides which fields show and
// which endpoint runs. Tabs flip `mode` in place — no navigation — so a
// returning user switches "Log in" <-> "Create account" effortlessly.
export default function AuthForm({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const { login, refreshUser } = useUser();

  const isLogin = mode === "login";

  function switchMode(next) {
    setMode(next);
    setErrors([]); // stale errors from the other mode would confuse the user
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      // Reuse the context's login() so UserContext refreshes (fixes the old
      // bare-Login bug where the app stayed "logged out" after a real login).
      const result = await login(form.email, form.password);
      if (!result.ok) {
        setErrors(result.errors || [{ msg: "Login failed" }]);
        return;
      }
      navigate("/");
      return;
    }

    // Signup: there is intentionally no register() in context, so POST here
    // then refreshUser() to populate the session.
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.errors) {
      setErrors(data.errors);
      return;
    }
    await refreshUser();
    navigate("/");
  }

  return (
    <div className="signup-form-wrapper">
      <div className="signup-card">
        <button
          type="button"
          className="auth-back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <Link to="/ordernow" className="logo-link" aria-label="Go to menu">
          <Logo />
        </Link>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`auth-tab ${isLogin ? "is-active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`auth-tab ${!isLogin ? "is-active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Create account
          </button>
        </div>

        {errors.map((err, i) => (
          <div key={i} className="alert alert-danger">
            {err.msg}
          </div>
        ))}

        <form className="inputs-wrapper" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="User Name"
            />
          )}
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
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
          )}
          <button type="submit">{isLogin ? "Log in" : "Create Account"}</button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
