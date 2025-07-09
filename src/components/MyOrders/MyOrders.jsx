import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { getOrders, updateOrderStatus } from "../../api/Orders";
import Swal from "sweetalert2";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadMyOrders() {
      const res = await getOrders();
      setOrders(res.data);
    }
    loadMyOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      try {
        await updateOrderStatus(orderId, "CANCELLED");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: "CANCELLED", status_display: "Cancelado" }
              : order
          )
        );
        Swal.fire("Cancelado", "Tu pedido ha sido cancelado.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cancelar el pedido.", "error");
      }
    }
  };

  const canBeCancelled = (status) => {
    return status === "PENDING" || status === "PAID";
  };

  return (
    <>
      <Navbar />
      <div className="my-orders-container">
        <h2>Mis Pedidos</h2>
        {orders.length === 0 ? (
          <p>No tienes pedidos aún.</p>
        ) : (
          orders.map((order) => (
            <div className="my-order-card" key={order.id}>
              <div className="my-order-info">
                <p>
                  <strong>Dirección:</strong> {order.address}, {order.city},{" "}
                  {order.department}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Estado:</strong> {order.status_display}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  ${parseFloat(order.total_price).toLocaleString()}
                </p>
                {canBeCancelled(order.status) && (
                  <button
                    className="cancel-order-button"
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
              <div className="my-order-items">
                <p>
                  <strong>Productos:</strong>
                </p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.variant_name} - Talla {item.size} - Cantidad:{" "}
                      {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;