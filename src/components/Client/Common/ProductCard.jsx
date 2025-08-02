import React, { useState, useEffect, memo } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import "./ProductCard.css";

const ProductCard = ({ product, variant, isInWishlist, onToggleWishlist, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = variant.images && variant.images.length > 0
    ? variant.images
    : [{ image: "/img/no-image.jpg" }];

  // Preload next image (UX perceived improvement)
  useEffect(() => {
    if (images.length > 1 && currentImageIndex + 1 < images.length) {
      const preload = new Image();
      preload.src = images[(currentImageIndex + 1) % images.length].image;
    }
  }, [currentImageIndex, images]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleWishlistClick = (e) => {
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
  };

  return (
    <div
      className="product-card"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="wishlist-icon" onClick={handleWishlistClick}>
        {isInWishlist ? (
          <FaHeart className="heart-icon filled" />
        ) : (
          <FaRegHeart className="heart-icon" />
        )}
      </div>

      {parseFloat(variant.discount) > 0 && (
        <div className="discount-badge">-{variant.discount_label}</div>
      )}

      <div className="image-wrapper">
        <img
          src={images[currentImageIndex]?.image || "/img/no-image.jpg"}
          alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
          className="product-image fade-image"
          loading="lazy"
        />

        {images.length > 1 && isHovered && (
          <>
            <button className="nav-button prev" onClick={handlePrev} aria-label="Imagen anterior">‹</button>
            <button className="nav-button next" onClick={handleNext} aria-label="Imagen siguiente">›</button>
          </>
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        {parseFloat(variant.discount) > 0 ? (
          <p>
            <span className="price-old">
              ${Number(product.price).toLocaleString("es-CO")}
            </span>{" "}
            <span className="price-new">
              ${Number(variant.final_price).toLocaleString("es-CO")}
            </span>
          </p>
        ) : (
          <p className="price">
            ${Number(product.price).toLocaleString("es-CO")}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(ProductCard);
