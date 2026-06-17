import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./components/pages/Homepage/Homepage";
import Menu from "./components/pages/Menu";
import AuthForm from "./components/pages/AuthForm/AuthForm";
import Todos from "./components/pages/Todos";
import Manage from "./components/pages/Manage";
import ItemModal from "./components/ItemModal/ItemModal";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";

// Modal-as-a-route pattern. When a menu card is clicked we navigate to
// /item/:itemParam but stash the page we came from in location.state
// (backgroundLocation). React Router then renders the MENU using that stashed
// location, and renders the ItemModal route ON TOP. On a direct visit/refresh
// of /item/... there is no backgroundLocation, so the main <Routes> matches
// /item/... itself and the (fullscreen) modal shows on its own.
// Docs recipe: "react router modal backgroundLocation".
function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Homepage />} />
        <Route path="/ordernow" element={<Menu />} />
        <Route path="/login" element={<AuthForm initialMode="login" />} />
        <Route path="/signup" element={<AuthForm initialMode="signup" />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/manage" element={<Manage />} />
        {/* Also matched on direct visit / refresh (no background behind it). */}
        <Route path="/item/:itemParam" element={<ItemModal />} />
      </Routes>

      {/* Overlay route: only when we arrived from a card (have a background). */}
      {backgroundLocation && (
        <Routes>
          <Route path="/item/:itemParam" element={<ItemModal />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
