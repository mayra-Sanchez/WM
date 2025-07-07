import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ProductModal from "./ProductModal";
import "./ProductsByType.css";

const ProductsByType = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isSub = location.pathname.includes("/subcategoria/");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("http://localhost:8000/products/api/categories/"),
          axios.get("http://localhost:8000/products/api/products/"),
        ]);

        const idInt = parseInt(id);
        let nombreActual = "";
        let filtrados = [];
        let subcats = [];

        catRes.data.forEach((cat) => {
          if (cat.id === idInt && !isSub) {
            nombreActual = cat.name;
            subcats = cat.subcategories;
            const subIds = subcats.map((sub) => sub.id);

            filtrados = prodRes.data.filter(
              (p) => p.category === cat.id || subIds.includes(p.category)
            );
          } else {
            cat.subcategories.forEach((sub) => {
              if (sub.id === idInt) {
                nombreActual = sub.name;
                filtrados = prodRes.data.filter((p) => p.category === sub.id);
              }
            });
          }
        });

        setNombre(nombreActual);
        setProductos(filtrados);
        setSubcategorias(subcats);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchData();
  }, [id, location.pathname]);

  const getDiscountedVariant = (variants) => {
    return variants?.find(v => parseFloat(v.discount) > 0) || variants?.[0];
  };

  return (
    <>
      <Navbar />
      <main className="products-container">
        <h2 className="category-title">
          {isSub ? "Subcategoría" : "Categoría"}: {nombre}
        </h2>

        {!isSub && subcategorias.length > 0 && (
          <div className="subcategories-container">
            <p className="subcategories-title">Explora subcategorías:</p>
            <div className="subcategories-chips">
              {subcategorias.map((sub) => (
                <button
                  key={sub.id}
                  className="subcategory-chip"
                  onClick={() => navigate(`/subcategoria/${sub.id}`)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {productos.length > 0 ? (
          <div className="product-grid">
            {productos.map((prod) => {
              const variant = getDiscountedVariant(prod.variants);

              return (
                <div
                  key={prod.id}
                  className="product-card"
                  onClick={() => setSelectedProduct(prod)}
                >
                  {variant && parseFloat(variant.discount) > 0 && (
                    <span className="discount-badge">-{variant.discount_label}</span>
                  )}

                  <div className="product-image-wrapper">
                    <img
                      src={variant?.images?.[0]?.image || "/img/no-image.jpg"}
                      alt={prod.name}
                      className="product-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="product-info">
                    <h3>{prod.name}</h3>
                    {variant && parseFloat(variant.discount) > 0 ? (
                      <p>
                        <span className="price-old">${prod.price}</span>{" "}
                        <span className="price-new">${variant.final_price.toFixed(2)}</span>
                      </p>
                    ) : (
                      <p className="price">${prod.price}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No hay productos en esta {isSub ? "subcategoría" : "categoría"}.</p>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Footer />
    </>
  );
};

export default ProductsByType;
