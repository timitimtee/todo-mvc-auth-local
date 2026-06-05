import restaurantImg from "../Nav/restaurant.png";
import "./Logo.css";

export default function Logo() {
  return (
    <div className="logo">
      <img src={restaurantImg} alt="Restaurant logo" />
    </div>
  );
}
