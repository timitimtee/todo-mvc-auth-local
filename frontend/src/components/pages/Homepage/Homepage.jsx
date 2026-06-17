import Nav from "../../Nav/Nav";
import MenuItems from "../../MenuItems/MenuItems";
import DeliveryPickupPill from "../../DeliveryPickupPill/DeliveryPickupPill";
import ViewOrderButton from "../../ViewOrderButton/ViewOrderButton";
import AddedModal from "../../AddedModal/AddedModal";
import "./Homepage.css";
import heroImage from "./biofresh-hero-3.jpg";

export default function Homepage() {
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
      {/* Floating "View order" pill + the post-add confirmation modal. Both read
          the cart from CartContext, so they only appear when relevant. */}
      <ViewOrderButton />
      <AddedModal />
    </>
  );
}
