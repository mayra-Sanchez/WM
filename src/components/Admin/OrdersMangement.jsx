import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/Orders";
import { FaLock } from "react-icons/fa";
import Swal from 'sweetalert2';
import "./OrdersManagement.css";

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            try {
                const res = await getOrders();
                setOrders(res.data);
                console.log(res.data);

            } catch (error) {
                console.error("Error al cargar órdenes:", error);
            } finally {
                setLoading(false);
            }
        }
        loadOrders();
    }, []);


    if (loading) return <p className="orders-loading">Cargando órdenes...</p>;
    if (orders.length === 0) return <p className="orders-empty">No hay órdenes registradas.</p>;

    const getStatusDisplay = (status) => {
        const map = {
            PENDING: "Pendiente",
            PAID: "Pagado",
            SHIPPED: "Enviado",
            CANCELLED: "Cancelado"
        };
        return map[status] || status;
    };

    return (
        <div className="orders-container">
            <div className="orders-grid">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div>
                                <h3>Orden #{order.id}</h3>
                                <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="order-status-container">
                                <div className="order-status-container">
                                    {order.status === "CANCELLED" ? (
                                        <div
                                            className={`order-status ${order.status.toLowerCase()} disabled-select`}
                                            onClick={() =>
                                                Swal.fire({
                                                    icon: "info",
                                                    title: "Estado bloqueado",
                                                    text: `Esta orden fue cancelada y no puede modificarse.`,
                                                    confirmButtonColor: "#E63946"
                                                })
                                            }
                                        >
                                            Cancelada <FaLock />
                                        </div>
                                    ) : (
                                        <select
                                            className={`order-status ${order.status.toLowerCase()}`}
                                            value={order.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;

                                                if (newStatus === "CANCELLED") {
                                                    const result = await Swal.fire({
                                                        title: "¿Estás seguro?",
                                                        text: `¿Deseas cancelar la orden #${order.id}? Esta acción no se puede deshacer.`,
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#E63946",
                                                        cancelButtonColor: "#6B7280",
                                                        confirmButtonText: "Sí, cancelar",
                                                        cancelButtonText: "No"
                                                    });

                                                    if (!result.isConfirmed) return;
                                                }

                                                try {
                                                    await updateOrderStatus(order.id, newStatus);
                                                    setOrders((prevOrders) =>
                                                        prevOrders.map((o) =>
                                                            o.id === order.id
                                                                ? {
                                                                    ...o,
                                                                    status: newStatus,
                                                                    status_display: getStatusDisplay(newStatus)
                                                                }
                                                                : o
                                                        )
                                                    );

                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "Estado actualizado",
                                                        text: `La orden #${order.id} ha sido marcada como "${getStatusDisplay(
                                                            newStatus
                                                        )}".`,
                                                        confirmButtonColor: "#E63946"
                                                    });
                                                } catch (err) {
                                                    console.error("Error al actualizar estado:", err);
                                                    Swal.fire({
                                                        icon: "error",
                                                        title: "Error",
                                                        text: "No se pudo actualizar el estado. Intenta de nuevo.",
                                                        confirmButtonColor: "#E63946"
                                                    });
                                                }
                                            }}
                                        >
                                            <option value="PENDING">Pendiente</option>
                                            <option value="PAID">Pagada</option>
                                            <option value="SHIPPED">Enviada</option>
                                            <option value="CANCELLED">Cancelada</option>
                                        </select>
                                    )}
                                </div>

                            </div>


                        </div>
                            <div className="order-user">
                                <p><strong>Cliente:</strong> {order.customer_name}</p>
                                <p><strong>Correo:</strong> {order.customer_email}</p>
                                <p><strong>Teléfono:</strong> {order.customer_phone || "No registrado"}</p>
                            </div>

                        <div className="order-address">
                            <p><strong>Departamento:</strong> {order.department}</p>
                            <p><strong>Ciudad:</strong> {order.city}</p>
                            <p><strong>Dirección:</strong> {order.address}</p>
                        </div>

                        <div className="order-items">
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.id}>
                                        <div className="item-info">
                                            <strong>{item.variant_name}</strong> — Talla: <span>{item.size}</span><br />
                                            Cantidad: <strong>{item.quantity}</strong> — Precio: ${item.price.toLocaleString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="order-total">
                            Total: <strong>${order.total_price.toLocaleString()}</strong>
                        </div>
                    </div>

                ))}
            </div>
        </div>

    );
};

export default OrdersManagement;
