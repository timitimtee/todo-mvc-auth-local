import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    email: "test1@example.com",
    role: "admin",
  });

  async function login(email, passowrd) {
    setUser({ email: "hardcoded@test.com", role: "user" });
  }

  async function register(email, passowrd) {}

  async function logout() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}
