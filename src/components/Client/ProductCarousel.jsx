import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProductModal from "./ProductModal";
import "./ProductCarousel.css";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../../contexts/WishlistContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ProductCard from "./Common/ProductCard";

const ProductCarousel = () => {
  const [agrupadosPorCategoria, setAgrupadosPorCategoria] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const carouselRefs = useRef({});

  const { wishlist, add, remove } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/products/api/categories/"),
          axios.get("http://127.0.0.1:8000/products/api/products"),
        ]);

        const categoriasPrincipales = catRes.data.filter(cat => cat.parent === null);
        const agrupados = {};

        categoriasPrincipales.forEach((cat) => {
          const subIds = cat.subcategories.map((sub) => sub.id);
          const productos = prodRes.data.filter(
            (p) => p.category === cat.id || subIds.includes(p.category)
          );
          if (productos.length > 0) {
            agrupados[cat.name] = { productos, id: cat.id };
          }
        });

        setAgrupadosPorCategoria(agrupados);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const autoplay = setInterval(() => {
      Object.keys(carouselRefs.current).forEach((categoria) => {
        scrollCarousel(categoria, "right");
      });
    }, 8000);

    return () => clearInterval(autoplay);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const scrollCarousel = (categoria, direction) => {
    const scrollAmount = 300;
    const ref = carouselRefs.current[categoria];
    if (!ref) return;
    ref.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const isInWishlist = (productId) => wishlist.some(item => item.product === productId);

  const getDiscountedVariant = (variants) => {
    return variants.find(variant => parseFloat(variant.discount) > 0) || variants[0];
  };

  return (
    <div className="carousels-container">
      {loading ? (
        <div className="carousel-wrapper">
          <div className="carousel-header"><div className="carousel-title">Cargando...</div></div>
          <div className="carousel">
            {[...Array(4)].map((_, idx) => (
              <div className="skeleton-card" key={idx}>
                <div className="skeleton-image" />
                <div className="skeleton-info">
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        Object.entries(agrupadosPorCategoria).map(([categoria, { productos, id }]) => (
          <div key={categoria} className="carousel-wrapper">
            <div className="carousel-header">
              <h2 className="carousel-title">{categoria}</h2>
              <button
                className="view-more"
                onClick={() => navigate(`/categoria/${id}`)}
              >
                Ver más
              </button>
            </div>

            <div className="carousel-container">
              <button className="arrow left" onClick={() => scrollCarousel(categoria, "left")}>
                <FaChevronLeft />
              </button>

              <div className="carousel" ref={(el) => (carouselRefs.current[categoria] = el)}>
                {productos.map((prod) => {
                  const variant = getDiscountedVariant(prod.variants);
                  return (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      variant={variant}
                      isInWishlist={isInWishlist(prod.id)}
                      onToggleWishlist={(id) => {
                        const item = wishlist.find((i) => i.product === id);
                        item ? remove(item.id) : add(id);
                      }}
                      onClick={() => handleProductClick(prod)}
                    />
                  );
                })}
              </div>

              <button className="arrow right" onClick={() => scrollCarousel(categoria, "right")}>
                <FaChevronRight />
              </button>
            </div>
          </div>
        ))
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ProductCarousel;
