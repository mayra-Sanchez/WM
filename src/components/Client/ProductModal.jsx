import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import Swal from "sweetalert2";
import "react-medium-image-zoom/dist/styles.css";
import "./ProductModal.css";
import { useCart } from "../../contexts/CartContext";

const ProductModal = ({ product, isOpen, onClose, addToCart = () => {} }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!product || product.variants.length === 0) return;

    const discountedIndex = product.variants.findIndex(
      (v) => parseFloat(v.discount) > 0
    );
    const defaultIndex = discountedIndex >= 0 ? discountedIndex : 0;

    const initialImage =
      product.variants[defaultIndex]?.images?.[0]?.image || null;

    setSelectedVariantIndex(defaultIndex);
    setSelectedSize(null);
    setMainImage(initialImage);
    setQuantity(1);

    if (initialImage) {
      const preload = new Image();
      preload.src = initialImage;
    }
  }, [product]);

  if (!product) return null;

  const variant = product.variants[selectedVariantIndex];
  const images = variant.images || [];
  const sizes = variant.sizes || [];

  const selectedSizeObj = sizes.find((s) => s.size === selectedSize);

  const handleAddToCart = () => {
    const isLoggedIn = !!localStorage.getItem("accessToken");

    if (!isLoggedIn) {
      return Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión",
        text: "Inicia sesión para agregar productos al carrito.",
        background: "#fff",
        color: "#000",
        confirmButtonColor: "#e63946",
      });
    }

    if (selectedSizeObj && selectedSizeObj.stock === 0) {
      return Swal.fire({
        icon: "error",
        title: "Producto agotado",
        text: "Esta talla está actualmente agotada.",
        background: "#1e1e1e",
        color: "#fff",
        confirmButtonColor: "#e63946",
      });
    }

    addItem({
      variant: variant.id,
      size: selectedSizeObj.id,
      quantity: quantity,
    });

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: `${product.name} ha sido añadido al carrito`,
      imageUrl: mainImage,
      imageWidth: 80,
      imageHeight: 80,
      imageAlt: product.name,
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#e63946",
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              &times;
            </button>

            {/* 🖼️ Izquierda */}
            <div className="modal-left">
              <div className="modal-main-img">
                <Zoom>
                  <img
                    src={mainImage || images[0]?.image}
                    alt={product.name}
                    loading="lazy"
                  />
                </Zoom>

                {parseFloat(product.discount) > 0 && (
                  <div className="discount-badge">
                    -
                    {Math.round(
                      (parseFloat(product.discount) * 100) /
                        parseFloat(product.price)
                    )}
                    %
                  </div>
                )}
              </div>

              <div className="modal-gallery">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.image}
                    alt={`Variante ${idx}`}
                    loading="lazy"
                    className={`modal-thumbnail ${
                      mainImage === img.image ? "active" : ""
                    }`}
                    onClick={() => setMainImage(img.image)}
                  />
                ))}
              </div>
            </div>

            {/* 🛒 Derecha */}
            <div className="modal-right">
              <h2>{product.name}</h2>

              <div className="modal-price">
                {variant.discount && parseFloat(variant.discount) > 0 ? (
                  <>
                    <span className="old-price">
                      ${Number(product.price).toLocaleString("es-CO")}
                    </span>
                    <span className="new-price">
                      ${Number(variant.final_price).toLocaleString("es-CO")}
                    </span>
                    <div className="discount-badge">
                      -{variant.discount_label}
                    </div>
                  </>
                ) : (
                  <span className="normal-price">
                    ${Number(product.price).toLocaleString("es-CO")}
                  </span>
                )}
              </div>

              <div className="modal-description">
                {showFullDescription
                  ? product.description
                  : `${product.description.slice(0, 100)}...`}
                {product.description.length > 100 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="ver-mas"
                  >
                    {showFullDescription ? "Ver menos" : "Ver más"}
                  </button>
                )}
              </div>

              {/* Variantes */}
              <div className="modal-variants">
                <strong>Color:</strong>
                <div className="color-options">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setMainImage(v.images?.[0]?.image || null);
                        setSelectedSize(null);
                        setQuantity(1);
                      }}
                      className={`color-button ${
                        selectedVariantIndex === idx ? "selected" : ""
                      }`}
                      aria-label={`Seleccionar color ${v.color}`}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tallas */}
              <div className="modal-sizes">
                <strong>Tallas disponibles:</strong>
                <div className="size-options">
                  {sizes.map((s) => {
                    const isOutOfStock = s.stock === 0;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(s.size);
                            setQuantity(1);
                          }
                        }}
                        className={`size-box ${
                          selectedSize === s.size ? "selected" : ""
                        } ${isOutOfStock ? "out-of-stock" : ""}`}
                        disabled={isOutOfStock}
                        aria-label={`Talla ${s.size}${
                          isOutOfStock ? " agotada" : ""
                        }`}
                      >
                        {s.size} {isOutOfStock && "(Agotado)"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cantidad */}
              <div className="modal-quantity">
                <strong>Cantidad:</strong>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="qty-btn"
                    aria-label="Disminuir cantidad"
                  >
                    &minus;
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedSizeObj && quantity < selectedSizeObj.stock) {
                        setQuantity((prev) => prev + 1);
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Stock insuficiente",
                          text: "No puedes agregar más productos que los disponibles.",
                          background: "#1e1e1e",
                          color: "#fff",
                          confirmButtonColor: "#e63946",
                        });
                      }
                    }}
                    className="qty-btn"
                    disabled={
                      selectedSizeObj ? quantity >= selectedSizeObj.stock : true
                    }
                    aria-label="Aumentar cantidad"
                  >
                    &#43;
                  </button>
                </div>

                {selectedSizeObj &&
                  selectedSizeObj.stock <= 5 &&
                  selectedSizeObj.stock > 0 && (
                    <p className="stock-info stock-low">
                      Quedan {selectedSizeObj.stock} disponibles
                    </p>
                  )}
                {selectedSizeObj && selectedSizeObj.stock === 0 && (
                  <p className="stock-info stock-out">Agotado</p>
                )}
              </div>

              {/* Botón */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || selectedSizeObj?.stock === 0}
                className="add-to-cart"
              >
                {selectedSizeObj?.stock === 0
                  ? "Agotado"
                  : "Agregar al carrito"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ProductModal);
