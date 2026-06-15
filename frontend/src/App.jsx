import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/pages/Homepage/Homepage";
import Menu from "./components/pages/Menu";
import AuthForm from "./components/pages/AuthForm/AuthForm";
import Todos from "./components/pages/Todos";
import Manage from "./components/pages/Manage";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ordernow" element={<Menu />} />
          <Route path="/login" element={<AuthForm initialMode="login" />} />
          <Route path="/signup" element={<AuthForm initialMode="signup" />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
