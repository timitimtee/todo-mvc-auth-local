import restaurantImg from "./biofreshLogofb.png";
import "./Logo.css";

export default function Logo() {
  return (
    <div className="logo">
      <img src={restaurantImg} alt="Restaurant logo" />
    </div>
  );
}
