import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api/Orders";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import DepartamentCitySelect from "./DepartmentCitySelection";
import './OrderSummary.css';

const OrderSummary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    direccion: "",
    departamento: "",
    ciudad: "",
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    const { direccion, departamento, ciudad } = formData;

    if (!direccion || !departamento || !ciudad) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos de envío.",
        confirmButtonColor: "#aaa",
      });
      return;
    }

    try {
      setLoading(true);

      await createOrder({
        address: direccion,
        department: departamento,
        city: ciudad,
      });

      await Swal.fire({
        icon: "success",
        title: "¡Pedido realizado!",
        text: "Tu orden ha sido registrada con éxito.",
        confirmButtonText: "Ver mis pedidos",
      });

      navigate("/my-orders");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear la orden",
        text:
          error.response?.data?.detail ||
          "Ocurrió un problema al procesar tu pedido.",
        confirmButtonColor: "#d63384",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems) return <p>Cargando carrito...</p>;

  const total = cartItems.reduce(
    (acc, item) => acc + item.variant.final_price * item.quantity,
    0
  );

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">FINALIZA TU PEDIDO</h2>

      <div className="checkout-grid">
        <div className="checkout-form">
          <h3>Datos para el envío</h3>

          <div className="input-group">
            <FiUser className="input-icon" />
            <input type="text" value={user?.name || ""} disabled />
          </div>

          <div className="input-group">
            <FiMail className="input-icon" />
            <input type="email" value={user?.email || ""} disabled />
          </div>

          <div className="input-group">
            <FiPhone className="input-icon" />
            <input type="text" value={user?.phone_number || ""} disabled />
          </div>

          <div className="input-group">
            <FiMapPin className="input-icon" />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección de entrega"
              value={formData.direccion}
              onChange={handleInputChange}
            />
          </div>

          <DepartamentCitySelect
            onChange={(values) => setFormData((prev) => ({ ...prev, ...values }))}
          />

          <button
            onClick={handleConfirmOrder}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "Procesando..." : "Confirmar Pedido"}
          </button>
        </div>

        <div className="checkout-cart">
          <h3>Resumen del pedido</h3>

          {cartItems.length === 0 ? (
            <p className="empty-summary">Tu carrito está vacío.</p>
          ) : (
            <>
              {cartItems.map((item, idx) => (
                <div key={idx} className="checkout-item">
                  <img
                    src={item.variant.images?.[0]?.image || "/default-product.jpg"}
                    alt={item.variant.color}
                  />
                  <div>
                    <p className="item-name">{item.product_name}</p>
                    <p className="item-checkout-detail">Color: {item.variant.color}</p>
                    <p className="item-checkout-detail">Talla: {item.size.size}</p>
                    <p className="item-checkout-detail">Cantidad: {item.quantity}</p>
                    <p className="item-price">
                      ${item.variant.final_price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="checkout-total">
                <span>Total:</span>
                <strong>${total.toLocaleString()}</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;