import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import "./ProductCard.css"; // Opcional: si necesitas estilos separados

const ProductCard = ({ product, variant, isInWishlist, onToggleWishlist, onClick }) => {
  return (
    <div className="product-card" onClick={onClick}>
      <div
        className="wishlist-icon"
        onClick={(e) => {
          e.stopPropagation();
          const isLoggedIn = !!localStorage.getItem("accessToken");
          if (!isLoggedIn) {
            Swal.fire({
              icon: "warning",
              title: "Debes iniciar sesión",
              text: "Inicia sesión para agregar productos a tu Lista de Deseos.",
              confirmButtonText: "Cerrar",
              confirmButtonColor: "#E63946",
            });
            return;
          }
          onToggleWishlist(product.id);
        }}
      >
        {isInWishlist ? (
          <FaHeart className="heart-icon filled" />
        ) : (
          <FaRegHeart className="heart-icon" />
        )}
      </div>

      {parseFloat(variant.discount) > 0 && (
        <div className="discount-badge">-{variant.discount_label}</div>
      )}

      <img
        loading="lazy"
        src={variant.images[0]?.image || "/img/no-image.jpg"}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h3>{product.name}</h3>
        {parseFloat(variant.discount) > 0 ? (
          <p>
            <span className="price-old">${product.price}</span>{" "}
            <span className="price-new">${variant.final_price.toFixed(2)}</span>
          </p>
        ) : (
          <p className="price">${product.price}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
