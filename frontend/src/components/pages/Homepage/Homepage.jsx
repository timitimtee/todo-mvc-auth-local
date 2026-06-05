import Nav from "../../Nav/Nav";
import OrderNow from "../../OrderNow/OrderNow";
import MenuItems from "../../MenuItems/MenuItems";
import "./Homepage.css";
import "../../DeliveryPickupPill/DeliveryPickupPill";
import DeliveryPickupPill from "../../DeliveryPickupPill/DeliveryPickupPill";

export default function Homepage() {
  return (
    <>
      <Nav />
      <DeliveryPickupPill />
      <MenuItems />
      <OrderNow />
    </>
  );
}
