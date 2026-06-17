import Nav from "../../Nav/Nav";
import MenuItems from "../../MenuItems/MenuItems";
import DeliveryPickupPill from "../../DeliveryPickupPill/DeliveryPickupPill";
import ViewOrderButton from "../../ViewOrderButton/ViewOrderButton";
import AddedModal from "../../AddedModal/AddedModal";
import { useCart } from "../../../hooks/useCart";
import "./Homepage.css";
import heroImage from "./biofresh-hero-3.jpg";

export default function Homepage() {
  const { count } = useCart();

  return (
    <>
      <Nav />
      <div className="hero-image-container">
        <img src={heroImage}></img>
      </div>
      <div className="menu-wrapper">
        <DeliveryPickupPill />
        <MenuItems />
      </div>
      {/* Spacer so the fixed pill below doesn't cover the last menu row. */}
      {count > 0 && <div className="view-order-spacer" />}
      {/* Floating "View order" pill + the post-add confirmation modal. Both read
          the cart from CartContext, so they only appear when relevant. */}
      <ViewOrderButton />
      <AddedModal />
    </>
  );
}
