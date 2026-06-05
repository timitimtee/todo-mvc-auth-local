import Nav from "../../Nav/Nav";
import OrderNow from "../../OrderNow/OrderNow";
import MenuItems from "../../MenuItems/MenuItems";
import "./Homepage.css";

export default function Homepage() {
  return (
    <>
      <Nav />
      <h1 className="title">Biofresh</h1>
      <MenuItems />
      <OrderNow />
    </>
  );
}
