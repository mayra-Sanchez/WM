import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api/Orders";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiShoppingCart,
} from "react-icons/fi";
import DepartamentCitySelect from "./DepartmentCitySelection";
import CheckoutSteps from "./CheckoutSteps";
import "./OrderSummary.css";

const OrderSummary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep] = useState(2);

  const [formData, setFormData] = useState({
    direccion: "",
    departamento: "",
    ciudad: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
        html: `
    <p>Tu orden ha sido registrada con éxito.</p>
    <p><strong>Recuerda:</strong> Debes realizar el pago según los métodos indicados en <strong>Mis pedidos</strong>.</p>
    <p>Si no realizas el pago en los próximos <strong>5 días hábiles</strong>, tu pedido será cancelado automáticamente.</p>
  `,
        confirmButtonText: "Entendido, ver mis pedidos",
        confirmButtonColor: "#28a745",
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

  const subtotal =
    cartItems?.reduce(
      (acc, item) => acc + item.variant.final_price * item.quantity,
      0
    ) || 0;

  const envio = subtotal >= 200000 ? 0 : 10000;
  const totalConEnvio = subtotal + envio;

  if (!cartItems) return <p>Cargando carrito...</p>;

  return (
    <div className="order-wrapper">
      <div className="order-header">
        <h2>Finaliza tu compra</h2>
        <CheckoutSteps currentStep={currentStep} />
      </div>

      <div className="order-content">
        <div className="order-form">
          <h3>
            <FiUser /> Información de envío
          </h3>

          <div className="info-block">
            <div className="input-icon-group">
              <FiUser />
              <input type="text" value={user?.name || ""} disabled />
            </div>
            <div className="input-icon-group">
              <FiMail />
              <input type="email" value={user?.email || ""} disabled />
            </div>
            <div className="input-icon-group">
              <FiPhone />
              <input type="text" value={user?.phone_number || ""} disabled />
            </div>
          </div>

          <h4>
            <FiMapPin /> Dirección
          </h4>

          <div className="input-label">
            <label>Dirección completa</label>
            <div className="input-icon-group">
              <FiMapPin />
              <input
                type="text"
                name="direccion"
                placeholder="Ej: Calle 123 # 4-56"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DepartamentCitySelect
            onChange={(values) =>
              setFormData((prev) => ({ ...prev, ...values }))
            }
          />

          <button
            className={`btn-confirm ${envio === 0 ? "free-shipping" : ""}`}
            onClick={handleConfirmOrder}
            disabled={loading || cartItems.length === 0}
          >
            {loading
              ? "Procesando..."
              : `Confirmar y pagar $${totalConEnvio.toLocaleString()} ${envio === 0 ? "(Envío gratis)" : ""
              }`}
          </button>
        </div>

        <div className="order-summary-box">
          <h3>
            <FiShoppingBag /> Resumen de compra
          </h3>
          <p>{cartItems.length} artículo(s)</p>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <FiShoppingCart size={36} />
              <p>Tu carrito está vacío</p>
              <button onClick={() => navigate("/")}>Seguir comprando</button>
            </div>
          ) : (
            <>
              <div className="order-items">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img
                      src={
                        item.variant.images?.[0]?.image ||
                        "/default-product.jpg"
                      }
                      alt={item.product_name}
                    />
                    <div className="item-data">
                      <strong>{item.product_name}</strong>
                      <small>
                        Color: {item.variant.color} | Talla: {item.size.size}
                      </small>
                      <span>
                        ${item.variant.final_price.toLocaleString()} x{" "}
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="total-block">
                <div className="row">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="row">
                  <span>Envío</span>
                  <span>{envio === 0 ? "Gratis" : `$${envio.toLocaleString()}`}</span>
                </div>
                <div className="row total">
                  <strong>Total</strong>
                  <strong>${totalConEnvio.toLocaleString()}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
