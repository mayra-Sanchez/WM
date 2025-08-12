import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { getOrders, updateOrderStatus } from "../../api/Orders";
import Swal from "sweetalert2";
import {
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiMessageSquare,
  FiUpload,
  FiSmartphone,
  FiX,
  FiCreditCard
} from "react-icons/fi";
import "./MyOrders.css";

const ITEMS_PER_PAGE = 5;
const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "ACTIVE", label: "Activos" },
  { value: "PENDING", label: "Pendientes" },
  { value: "PAID", label: "Pagados" },
  { value: "SHIPPED", label: "Enviados" },
  { value: "DELIVERED", label: "Entregados" },
  { value: "CANCELLED", label: "Cancelados" },
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic padding to clear top-bar and navbar
  useEffect(() => {
    const adjustPadding = () => {
      const topBar = document.querySelector('.top-bar');
      const navbar = document.querySelector('.navbar');
      const myOrdersWrapper = document.querySelector('.my-orders-wrapper');
      if (topBar && navbar && myOrdersWrapper) {
        const topBarHeight = topBar.offsetHeight;
        const navbarHeight = navbar.offsetHeight;
        const totalHeight = topBarHeight + navbarHeight + 16;
        myOrdersWrapper.style.paddingTop = `${totalHeight}px`;
      }
    };

    adjustPadding();
    window.addEventListener('resize', adjustPadding);
    return () => window.removeEventListener('resize', adjustPadding);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, imagesRes] = await Promise.all([
        getOrders(),
        axios.get("http://127.0.0.1:8000/products/api/images/"),
      ]);
      setOrders(ordersRes.data);
      setAllImages(imagesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("No se pudieron cargar los pedidos. Intenta nuevamente.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener",
      confirmButtonColor: "#ff4d4d",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
      focusCancel: true,
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
        Swal.fire({
          title: "¡Pedido cancelado!",
          text: "El pedido ha sido cancelado exitosamente.",
          icon: "success",
          confirmButtonColor: "#4CAF50",
        });
      } catch (err) {
        console.error("Error cancelling order:", err);
        Swal.fire({
          title: "Error",
          text: "No se pudo cancelar el pedido. Por favor intenta nuevamente.",
          icon: "error",
          confirmButtonColor: "#ff4d4d",
        });
      }
    }
  };

  const canBeCancelled = useCallback((status) => {
    return ["PENDING", "PAID"].includes(status);
  }, []);

  const getStatusIcon = useCallback((status) => {
    const iconProps = { className: "status-icon", size: 20 };
    switch (status) {
      case "PENDING":
        return <FiAlertCircle {...iconProps} style={{ color: "#F59E0B" }} />;
      case "PAID":
        return <FiDollarSign {...iconProps} style={{ color: "#3B82F6" }} />;
      case "SHIPPED":
        return <FiTruck {...iconProps} style={{ color: "#6366F1" }} />;
      case "DELIVERED":
        return <FiCheckCircle {...iconProps} style={{ color: "#10B981" }} />;
      case "CANCELLED":
        return <FiXCircle {...iconProps} style={{ color: "#EF4444" }} />;
      default:
        return <FiPackage {...iconProps} />;
    }
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filter !== "ALL") {
      result = result.filter((order) =>
        filter === "ACTIVE"
          ? ["PENDING", "PAID", "SHIPPED"].includes(order.status)
          : order.status === filter
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((order) =>
        order.id.toString().includes(query) ||
        order.items.some(item =>
          item.variant_name.toLowerCase().includes(query)
        ));
    }

    return result;
  }, [orders, filter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredOrders, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && !isRefreshing) {
    return (
      <>
        <div className="my-orders-wrapper">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando tus pedidos...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="my-orders-wrapper">
          <div className="error-message">
            <FiAlertCircle size={48} />
            <p>{error}</p>
            <button onClick={handleRefresh} className="refresh-button">
              <FiRefreshCw /> Intentar nuevamente
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="my-orders-wrapper">
        <div className="orders-section-header">
          <div className="orders-title-section">
            <h1>Mis Pedidos</h1>
            <p className="orders-count">
              {filteredOrders.length} {filteredOrders.length === 1 ? "pedido" : "pedidos"} encontrados
            </p>
          </div>

          <div className="orders-controls">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar pedidos o productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="filter-group">
              <FiFilter className="filter-icon" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="refresh-button"
            >
              <FiRefreshCw className={isRefreshing ? "spinning" : ""} />
              {isRefreshing ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <FiPackage size={64} />
            <h3>No hay pedidos {filter !== "ALL" ? "con estos filtros" : "registrados"}</h3>
            <p>
              {searchQuery
                ? "Intenta con otro término de búsqueda."
                : filter !== "ALL"
                  ? "Prueba cambiando los filtros."
                  : "Cuando hagas un pedido, aparecerá aquí."}
            </p>
            {filter !== "ALL" || searchQuery ? (
              <button
                onClick={() => {
                  setFilter("ALL");
                  setSearchQuery("");
                }}
                className="reset-filters-button"
              >
                Mostrar todos los pedidos
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="orders-list-container">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancel}
                  canBeCancelled={canBeCancelled}
                  getStatusIcon={getStatusIcon}
                  allImages={allImages}
                  formatDate={formatDate}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="pagination-button"
                  aria-label="Página anterior"
                >
                  <FiChevronLeft />
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                  aria-label="Página siguiente"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const OrderCard = ({
  order,
  onCancel,
  canBeCancelled,
  getStatusIcon,
  allImages,
  formatDate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('transfer');

  // Función toggleExpand que faltaba
  const toggleExpand = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setExpanded(!expanded);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const orderTotal = parseFloat(order.total_price).toLocaleString("es-ES", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handlePaymentConfirmation = () => {
    const phoneNumber = "573106366464"; // Tu número de WhatsApp
    const paymentMethod =
      activePaymentTab === 'transfer' ? 'Transferencia Bancaria' :
        activePaymentTab === 'nequi' ? 'Nequi' : 'Efectivo';

    const message = `*Confirmación de Pago - Pedido #${order.id}*\n\n` +
      `*Cliente:* ${order.customer_email || 'No especificado'}\n` +
      `*Método de Pago:* ${paymentMethod}\n` +
      `*Total Pagado:* ${orderTotal}\n` +
      `*Fecha:* ${new Date().toLocaleDateString('es-ES')}\n\n` +
      `Por favor confirma la recepción de este pago.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');

    Swal.fire({
      title: '¡Listo para confirmar!',
      html: `<div style="text-align: left;">
        <p>Se abrió WhatsApp con los detalles de tu pedido.</p>
        <p><strong>Por favor:</strong></p>
        <ul>
          <li>Adjunta el comprobante de pago</li>
          <li>Envía el mensaje para confirmar</li>
        </ul>
      </div>`,
      icon: 'info',
      confirmButtonText: 'Entendido'
    });

    setShowPaymentModal(false);
  };

  const PaymentMethodOption = ({ id, icon, title, details }) => (
    <div
      className={`payment-option ${activePaymentTab === id ? 'active' : ''}`}
      onClick={() => setActivePaymentTab(id)}
    >
      <div className="payment-option-header">
        {icon}
        <h4>{title}</h4>
      </div>
      {activePaymentTab === id && (
        <div className="payment-option-details">
          {details}
          <p className="instructions">
            Después de realizar el pago, confírmalo enviando el comprobante por WhatsApp.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className={`order-card ${order.status.toLowerCase()} ${expanded ? "expanded" : ""}`}>
      <div
        className="order-card-header"
        onClick={toggleExpand}
        aria-expanded={expanded}
      >
        <div className="order-meta">
          <div className="order-status">
            {getStatusIcon(order.status)}
            <span>{order.status_display}</span>
          </div>
          <div className="order-id">Pedido #{order.id}</div>
        </div>

        <div className="order-summary">
          <div className="order-date">
            <FiCalendar />
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="order-total">
            <FiDollarSign />
            <span>{orderTotal}</span>
          </div>
          <div className="order-items-count">
            <FiPackage />
            <span>{order.items.length} producto{order.items.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className={`expand-icon ${expanded ? "expanded" : ""}`}>
          <FiChevronRight />
        </div>
      </div>

      <div className={`order-details ${expanded ? "visible" : ""}`}>
        <div className="details-section">
          <h4>Información de envío</h4>
          <div className="shipping-info">
            <FiMapPin />
            <div>
              <p>
                <strong>Dirección:</strong> {order.address}, {order.city}, {order.department}
              </p>
              {order.tracking_number && (
                <p>
                  <strong>Número de seguimiento:</strong> {order.tracking_number}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Productos ({order.items.length})</h4>
          <ul className="products-list">
            {order.items.map((item) => {
              const variantId = item.variant;
              const productImage =
                allImages.find((img) => img.variant === variantId)?.image ||
                "/images/fallback-product.png";

              const itemPrice = item.price.toLocaleString("es-ES", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });

              return (
                <li key={item.id} className="product-item">
                  <div className="product-image-container">
                    <img
                      src={productImage}
                      alt={item.variant_name}
                      className="product-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/images/fallback-product.png";
                      }}
                    />
                  </div>

                  <div className="product-info">
                    <h5 className="product-name">{item.variant_name}</h5>
                    <div className="product-meta">
                      <span>Talla: {item.size}</span>
                      <span>Cantidad: {item.quantity}</span>
                    </div>
                    {item.discount > 0 && (
                      <div className="product-discount">
                        <span className="original-price">{itemPrice}</span>
                        <span className="discount-badge">
                          {item.discount}% OFF
                        </span>
                        <span className="final-price">
                          {(
                            item.price *
                            (1 - item.discount / 100)
                          ).toLocaleString("es-ES", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    )}
                    {item.discount <= 0 && (
                      <div className="product-price">{itemPrice}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="order-actions">
          {order.status === "PENDING" && (
            <div className="payment-section">
              <p className="payment-info">
                Tu pedido está pendiente de pago. Haz clic en <strong>“Métodos de pago”</strong> para completarlo y asegurar tu compra.
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="payment-methods-button"
                aria-label="Métodos de pago"
              >
                <FiDollarSign /> Métodos de pago
              </button>
            </div>
          )}

          {canBeCancelled(order.status) && (
            <button
              onClick={() => onCancel(order.id)}
              className="cancel-button"
              aria-label="Cancelar pedido"
            >
              <FiXCircle /> Cancelar pedido
            </button>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <button className="close-modal-button" onClick={() => setShowPaymentModal(false)}>
              <FiX />
            </button>

            <h3>Confirmar pago del pedido #{order.id}</h3>
            <p className="order-total-modal">Total a pagar: {orderTotal}</p>

            <div className="payment-options">
              <PaymentMethodOption
                id="transfer"
                icon={<FiCreditCard />}
                title="Transferencia Bancaria"
                details={
                  <div className="bank-details">
                    <p><strong>Banco:</strong> Bancolombia</p>
                    <p><strong>Cuenta:</strong> Ahorros 808-14534-91</p>
                    <p><strong>Titular:</strong> CAMILA SALINAS</p>
                  </div>
                }
              />

              <PaymentMethodOption
                id="nequi"
                icon={<FiSmartphone />}
                title="Pago por Nequi"
                details={
                  <div className="bank-details">
                    <p><strong>Número:</strong> 310 626 8134</p>
                    <p><strong>Nombre:</strong> María Camila Salinas </p>
                    <p><strong>Número:</strong> 310 636 6464</p>
                    <p><strong>Nombre:</strong> Jean Kenner Huacoto </p>
                  </div>
                }
              />

              <PaymentMethodOption
                id="cash"
                icon={<FiDollarSign />}
                title="Pago en Efectivo"
                details={
                  <div className="bank-details">
                    <p><strong>Puntos de pago:</strong></p>
                    <ul>
                      <li>Oficina principal: Centro comercial pasaje Cali local 163</li>
                    </ul>
                  </div>
                }
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={handlePaymentConfirmation}
                className="whatsapp-confirm-button"
              >
                <FiMessageSquare /> Confirmar pago por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;