// ProductModal.jsx mejorado
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import Swal from "sweetalert2";
import "react-medium-image-zoom/dist/styles.css";
import "./ProductModal.css";
import { useCart } from "../../contexts/CartContext";

const ProductModal = ({ product, isOpen, onClose, addToCart = () => { } }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantIndex(0);
      setSelectedSize(null);
      setMainImage(product.variants[0]?.images[0]?.image || null);
    }
  }, [product]);

  if (!product) return null;

  const variant = product.variants[selectedVariantIndex];
  const images = variant.images || [];
  const sizes = variant.sizes || [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona una talla",
        text: "Debes elegir una talla antes de agregar al carrito.",
        background: "#1e1e1e",
        color: "#fff",
        confirmButtonColor: "#e63946",
      });
      return;
    }

    const selectedSizeObj = sizes.find(s => s.size === selectedSize);

    if (!selectedSizeObj) {
      Swal.fire({
        icon: "error",
        title: "Talla no válida",
        text: "No se pudo encontrar el ID de la talla.",
        background: "#1e1e1e",
        color: "#fff",
        confirmButtonColor: "#e63946",
      });
      return;
    }

    addItem({
      variant: variant.id,
      size: selectedSizeObj.id,
      quantity: 1,
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
            <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
            <div className="modal-left">
              <div className="modal-main-img">
                <Zoom>
                  <img src={mainImage || images[0]?.image} alt={product.name} />
                </Zoom>
                {parseFloat(product.discount) > 0 && (
                  <div className="discount-badge">
                    -{Math.round((parseFloat(product.discount) * 100) / parseFloat(product.price))}%
                  </div>
                )}
              </div>
              <div className="modal-gallery">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.image}
                    alt={`Variante ${idx}`}
                    className={`modal-thumbnail ${mainImage === img.image ? "active" : ""}`}
                    onClick={() => setMainImage(img.image)}
                  />
                ))}
              </div>
            </div>
            <div className="modal-right">
              <h2>{product.name}</h2>
              <div className="modal-price">
                {parseFloat(product.discount) > 0 ? (
                  <>
                    <span className="old-price">${product.price}</span>
                    <span className="new-price">
                      ${(+product.price - +product.discount).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="new-price">${product.price}</span>
                )}
              </div>

              <div className="modal-description">
                {showFullDescription
                  ? product.description
                  : `${product.description.slice(0, 100)}...`}
                {product.description.length > 100 && (
                  <button onClick={() => setShowFullDescription(!showFullDescription)} className="ver-mas">
                    {showFullDescription ? "Ver menos" : "Ver más"}
                  </button>
                )}
              </div>

              <div className="modal-variants">
                <strong>Color:</strong>
                <div className="color-options">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setMainImage(v.images[0]?.image || null);
                        setSelectedSize(null);
                      }}
                      className={`color-button ${selectedVariantIndex === idx ? "selected" : ""}`}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-sizes">
                <strong>Tallas disponibles:</strong>
                <div className="size-options">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.size)}
                      className={`size-box ${selectedSize === s.size ? "selected" : ""}`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="add-to-cart"
              >
                Agregar al carrito
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
