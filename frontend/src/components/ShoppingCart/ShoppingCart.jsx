import "./ShoppingCart.css";
import shoppingCart from "./icons8-shopping-bag.png";
import SignInButton from "./SignInButton/SignInButton";

export default function ShoppingCart({ count }) {
  return (
    <>
      <div className="shopping-signin-container">
        <div className="shopping-cart">
          <img src={shoppingCart} alt="Shopping Bag" />
          <span className="cartCount">{count}</span>
        </div>
        <div className="sign-in">
          <SignInButton />
        </div>
      </div>
    </>
  );
}
