import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProductModal from "./ProductModal";
import "./ProductCarousel.css";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../../contexts/WishlistContext"; // ajusta si tu path es diferente
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ProductCarousel = () => {
  const [agrupadosPorCategoria, setAgrupadosPorCategoria] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const carouselRefs = useRef({});

  const { wishlist, add, remove } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/products/api/products")
      .then(res => {
        const agrupados = {};
        res.data.forEach((producto) => {
          const categoria = producto.category_detail;
          if (!agrupados[categoria]) agrupados[categoria] = [];
          agrupados[categoria].push(producto);
        });
        setAgrupadosPorCategoria(agrupados);
      })
      .catch(err => console.error("Error al obtener productos:", err));
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const scrollCarousel = (categoria, direction) => {
    const scrollAmount = 300;
    const ref = carouselRefs.current[categoria];
    if (ref) {
      ref.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.product === productId);
  };

  return (
    <div className="carousels-container">
      {Object.entries(agrupadosPorCategoria).map(([categoria, productos]) => (
        <div key={categoria} className="carousel-wrapper">
          <h2 className="carousel-title">{categoria}</h2>
          <div className="carousel-container">
            <button className="arrow left" onClick={() => scrollCarousel(categoria, "left")}>
              <FaChevronLeft />
            </button>

            <div
              className="carousel"
              ref={(el) => (carouselRefs.current[categoria] = el)}
            >
              {productos.map((prod) => (
                <div
                  key={prod.id}
                  className="product-card"
                  onClick={() => handleProductClick(prod)}
                >
                  
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
                        })
                        return;
                      }

                      const item = wishlist.find((i) => i.product === prod.id);
                      item ? remove(item.id) : add(prod.id);
                    }}
                  >
                    {isInWishlist(prod.id) ? (
                      <FaHeart className="heart-icon filled" />
                    ) : (
                      <FaRegHeart className="heart-icon" />
                    )}
                  </div>

                  {parseFloat(prod.discount) > 0 && (
                    <div className="discount-badge">
                      -{Math.round((parseFloat(prod.discount) * 100) / parseFloat(prod.price))}%
                    </div>
                  )}

                  <img
                    src={prod.variants[0]?.images[0]?.image}
                    alt={prod.name}
                    className="product-image"
                  />

                  <div className="product-info">
                    <h3>{prod.name}</h3>
                    {parseFloat(prod.discount) > 0 ? (
                      <p>
                        <span className="price-old">${prod.price}</span>{" "}
                        <span className="price-new">
                          ${(parseFloat(prod.price) - parseFloat(prod.discount)).toFixed(2)}
                        </span>
                      </p>
                    ) : (
                      <p className="price">${prod.price}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="arrow right" onClick={() => scrollCarousel(categoria, "right")}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      ))}

      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ProductCarousel;
