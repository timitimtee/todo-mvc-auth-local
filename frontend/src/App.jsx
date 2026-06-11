import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/pages/Homepage/Homepage";
import Menu from "./components/pages/Menu";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
