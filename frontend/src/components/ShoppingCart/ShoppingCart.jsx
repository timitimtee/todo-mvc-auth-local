import { useState } from "react";
import "./ShoppingCart.css";
import shoppingCart from "./icons8-shopping-bag.png";
import SignInButton from "./SignInButton/SignInButton";
import CartDrawer from "./CartDrawer/CartDrawer";

export default function ShoppingCart({ count }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="shopping-signin-container">
        <div className="shopping-cart" onClick={() => setDrawerOpen(true)}>
          <img src={shoppingCart} alt="Shopping Bag" />
          <span className="cartCount">{count}</span>
        </div>
        <div className="sign-in">
          <SignInButton />
        </div>
      </div>
      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
