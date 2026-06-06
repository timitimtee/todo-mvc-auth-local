import { useState } from "react";
import Nav from "../../Nav/Nav";
import OrderNow from "../../OrderNow/OrderNow";
import MenuItems from "../../MenuItems/MenuItems";
import "./Homepage.css";
import "../../DeliveryPickupPill/DeliveryPickupPill";
import DeliveryPickupPill from "../../DeliveryPickupPill/DeliveryPickupPill";

export default function Homepage() {
  const [cartCount, setCartCount] = useState(0);

  function handleAddItem() {
    setCartCount((c) => c + 1);
  }

  return (
    <>
      <Nav cartCount={cartCount} />
      <DeliveryPickupPill />
      <MenuItems onAddItem={handleAddItem} />
      <OrderNow />
    </>
  );
}
