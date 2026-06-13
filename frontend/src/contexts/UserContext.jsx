import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ask backend "who am I?" using the session cookie.
  // Used automatically on mount, and manually after a form login.
  async function refreshUser() {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Runs once on mount: covers page load, refresh, and return-from-Google.
  useEffect(() => {
    refreshUser();
  }, []);

  // Local email/password form only. Google does NOT use this (it redirects).
  async function login(email, password) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      await refreshUser();
      return { ok: true };
    }
    return { ok: false, errors: data.errors };
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
