import "./ShoppingCart.css";
import shoppingCart from "./icons8-shopping-bag.png";
import SignInButton from "./SignInButton/SignInButton";
import CartDrawer from "./CartDrawer/CartDrawer";
import { useCart } from "../../hooks/useCart";

export default function ShoppingCart() {
  const { count, openDrawer } = useCart();

  return (
    <>
      <div className="shopping-signin-container">
        <div className="shopping-cart" onClick={openDrawer}>
          <img src={shoppingCart} alt="Shopping Bag" />
          <span className="cartCount">{count}</span>
        </div>
        <div className="sign-in">
          <SignInButton />
        </div>
      </div>
      <CartDrawer />
    </>
  );
}
