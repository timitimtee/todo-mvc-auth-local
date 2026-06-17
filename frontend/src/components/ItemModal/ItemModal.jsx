import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { EXTRAS } from "../../cart/constants";
import "./ItemModal.css";

// /item/birria-quesadilla_6708ab12...  ->  the id is everything after the LAST
// "_". The slug before it is cosmetic and ignored (it can be stale/wrong and the
// lookup still works), exactly like the Toast/DoorDash URLs.
function parseId(itemParam) {
  const i = itemParam.lastIndexOf("_");
  return i === -1 ? itemParam : itemParam.slice(i + 1);
}

export default function ItemModal() {
  const { itemParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  // name -> qty for the extras the user has chosen.
  const [extraQty, setExtraQty] = useState({});

  const id = parseId(itemParam);

  // Fetch the item on its own so a refreshed / shared /item/... link works.
  // Reset per-item state up front so nothing leaks if the id changes while the
  // modal stays mounted.
  useEffect(() => {
    let active = true;
    setItem(null);
    setNotFound(false);
    setExtraQty({});
    fetch(`/api/menuitems/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => active && setItem(data.menuItem))
      .catch(() => active && setNotFound(true));
    return () => {
      active = false;
    };
  }, [id]);

  // Close = return to where we came from (menu) if we have history, else "/".
  function close() {
    if (location.state?.backgroundLocation) navigate(-1);
    else navigate("/");
  }

  function addExtra(name) {
    setExtraQty((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  }
  function removeExtra(name) {
    setExtraQty((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  const chosenExtras = EXTRAS.filter((e) => extraQty[e.name] > 0).map((e) => ({
    name: e.name,
    price: e.price,
    qty: extraQty[e.name],
  }));

  const extrasTotal = chosenExtras.reduce((s, e) => s + e.price * e.qty, 0);
  const total = item ? item.menu_item_price + extrasTotal : 0;

  function handleAdd() {
    addItem({
      menuItemId: item._id,
      name: item.menu_item_name,
      image: item.menu_item_image,
      price: item.menu_item_price,
      extras: chosenExtras,
    });
    // replace:true so the modal entry is dropped from history — Back from the
    // menu won't reopen the item we just added.
    navigate("/", { replace: true });
  }

  return (
    <div className="item-modal-overlay">
      <div className="item-modal">
        <button className="item-modal-close" onClick={close} aria-label="Close">
          ✕
        </button>

        {notFound && (
          <div className="item-modal-status">
            <p>Sorry, this item is no longer available.</p>
            <button className="item-modal-status-btn" onClick={close}>
              Back to menu
            </button>
          </div>
        )}

        {!notFound && !item && (
          <div className="item-modal-status">
            <p>Loading…</p>
          </div>
        )}

        {item && (
          <>
            <div className="item-modal-image-wrap">
              <img src={item.menu_item_image} alt={item.menu_item_name} />
            </div>

            <div className="item-modal-body">
              <h2 className="item-modal-name">{item.menu_item_name}</h2>
              <p className="item-modal-price">
                ${item.menu_item_price.toFixed(2)}
              </p>
              <p className="item-modal-description">
                {item.menu_item_description}
              </p>

              <h3 className="item-modal-section-title">Customize your item</h3>

              <div className="extras-group">
                <div className="extras-group-header">Extras</div>
                {EXTRAS.map((extra) => {
                  const qty = extraQty[extra.name] || 0;
                  return (
                    <div className="extra-row" key={extra.name}>
                      <div className="extra-info">
                        <span className="extra-name">{extra.name}</span>
                        <span className="extra-price">
                          +${extra.price.toFixed(2)}
                        </span>
                      </div>
                      {qty === 0 ? (
                        <button
                          className="extra-add-btn"
                          onClick={() => addExtra(extra.name)}
                          aria-label={`Add ${extra.name}`}
                        >
                          ＋
                        </button>
                      ) : (
                        <div className="extra-stepper">
                          <button
                            className="extra-trash-btn"
                            onClick={() => removeExtra(extra.name)}
                            aria-label={`Remove ${extra.name}`}
                          >
                            🗑
                          </button>
                          <span className="extra-qty">{qty}</span>
                          <button
                            className="extra-add-btn"
                            onClick={() => addExtra(extra.name)}
                            aria-label={`Add another ${extra.name}`}
                          >
                            ＋
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="item-modal-footer">
              <button className="add-to-cart-btn" onClick={handleAdd}>
                <span>Add to Cart</span>
                <span>${total.toFixed(2)}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
