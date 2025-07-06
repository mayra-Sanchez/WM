import { useEffect, useState } from "react";
import { FaHeart, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useWishlist } from "../../../contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import "./WishlistDropdown.css";

const WishlistDropdown = () => {
  const { wishlist, remove } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);
  
  return (
    <>
      <div className="icon-with-badge" onClick={toggleDropdown}>
        <FaHeart className="icon" />
        {wishlist.length > 0 && (
          <span className="cart-badge">{wishlist.length}</span>
        )}
      </div>

      <div className={`wishlist-dropdown ${isOpen ? "open" : ""}`}>
        <div className="wishlist-header">
          <h3 className="wishlist-title">Tu Lista de Deseos ({wishlist.length})</h3>
          <button onClick={closeDropdown} className="close-wishlist">
            <FaTimes />
          </button>
        </div>

        <div className="wishlist-items-list">
          {wishlist.length === 0 ? (
            <p className="wishlist-empty">No tienes productos guardados</p>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                <img
                  src={
                    item.product_detail?.variants?.[0]?.images?.[0]?.image ||
                    "https://via.placeholder.com/60"
                  }
                  alt={item.product_detail?.name}
                  className="wishlist-item-image"
                />
                <div className="wishlist-item-details">
                  <h4>{item.product_detail?.name || "Producto"}</h4>
                  <p>Precio: ${item.product_detail?.price || "N/A"}</p>
                </div>
                <button
                  className="delete-wishlist-item"
                  onClick={() => remove(item.id)}
                  title="Eliminar"
                >
                  <FaTrashAlt className="delete-wishlist-item-icon" />
                </button>
              </div>
            ))

          )}
        </div>

        {wishlist.length > 0 && (
          <div className="wishlist-footer">
            <button
              className="wishlist-see-all"
              onClick={() => {
                closeDropdown();
                navigate("/wishlist");
              }}
            >
              Ver mi wishlist
            </button>
          </div>
        )}
      </div>

      {isOpen && <div className="wishlist-overlay" onClick={closeDropdown} />}
    </>
  );
};

export default WishlistDropdown;