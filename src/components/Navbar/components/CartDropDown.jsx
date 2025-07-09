import { useEffect } from "react";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import "./CartDropdown.css";
import { useCart } from "../../../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartDropdown = ({ isOpen, onClose }) => {
  const { cartItems, fetchCart, removeItem, updateItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.subtotal || 0),
    0
  );

  return (
    <>
      <div className={`cart-dropdown ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3 className="cart-title">Tu Carrito ({cartItems.length})</h3>
          <button onClick={onClose} className="close-cart">
            <FaTimes />
          </button>
        </div>

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Tu carrito está vacío</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={
                    item.variant?.images?.[0]?.image ||
                    "https://via.placeholder.com/60"
                  }
                  alt="Producto"
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>Color: {item.variant?.color}</h4>
                  <p>Talla: {item.size?.size}</p>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateItem(item.id, {
                            quantity: item.quantity - 1,
                            variant_id: item.variant.id,
                            size_id: item.size.id,
                          });
                        }
                      }}
                    >
                      &minus;
                    </button>

                    <span className="quantity-display">{item.quantity}</span>

                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (item.quantity < item.size.stock) {
                          updateItem(item.id, {
                            quantity: item.quantity + 1,
                            variant_id: item.variant.id,
                            size_id: item.size.id,
                          });
                        }
                      }}
                      disabled={item.quantity >= item.size.stock}
                    >
                      &#43;
                    </button>
                  </div>

                  <p>Subtotal: ${item.subtotal?.toLocaleString()}</p>
                </div>
                <button
                  className="delete-cart-item"
                  onClick={() => removeItem(item.id)}
                  title="Eliminar"
                >
                  <FaTrashAlt className="delete-cart-item-icon" />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-total">
            <p>Total: ${totalPrice.toLocaleString()}</p>
            <button className="checkout-button" onClick={() => navigate('/checkout')}>Finalizar Compra</button>
          </div>
        )}
      </div>

      {isOpen && <div className="cart-overlay" onClick={onClose} />}
    </>
  );
};

export default CartDropdown;
