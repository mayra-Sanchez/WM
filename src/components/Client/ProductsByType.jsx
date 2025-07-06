import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ProductModal from "./ProductModal";
import "./ProductsByType.css";
import "../Navbar/Navbar.css"

const ProductsByType = () => {
  const { id } = useParams();
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isSub = location.pathname.includes("/subcategoria/");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/products/api/categories/"),
          axios.get("http://127.0.0.1:8000/products/api/products/"),
        ]);

        const idInt = parseInt(id);
        let nombreActual = "";
        let filtrados = [];

        catRes.data.forEach((cat) => {
          if (cat.id === idInt && !isSub) {
            // ✅ Categoría principal: incluir también sus subcategorías
            nombreActual = cat.name;

            const subIds = cat.subcategories.map((sub) => sub.id);
            filtrados = prodRes.data.filter(
              (p) => p.category === cat.id || subIds.includes(p.category)
            );
          } else {
            // ✅ Subcategoría: solo productos con esa categoría
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
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchData();
  }, [id, location.pathname]);

  return (
    <>
      <Navbar />
      <main className="products-container">
        <h2 className="category-title">
          {isSub ? "Subcategoría" : "Categoría"}: {nombre}
        </h2>

        {productos.length > 0 ? (
          <div className="product-grid">
            {productos.map((prod) => (
              <div
                key={prod.id}
                className="product-card"
                onClick={() => setSelectedProduct(prod)}
              >
                {parseFloat(prod.discount) > 0 && (
                  <span className="discount-badge">EN DESCUENTO</span>
                )}

                <div className="product-image-wrapper">
                  <img
                    src={
                      prod.variants?.[0]?.images?.[0]?.image ||
                      "/img/no-image.jpg"
                    }
                    alt={prod.name}
                    className="product-image"
                    loading="lazy"
                  />
                </div>

                <div className="product-info">
                  <h3>{prod.name}</h3>
                  {parseFloat(prod.discount) > 0 ? (
                    <p>
                      <span className="price-old">${prod.price}</span>{" "}
                      <span className="price-new">
                        $
                        {(
                          parseFloat(prod.price) - parseFloat(prod.discount)
                        ).toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p className="price">${prod.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>
            No hay productos en esta {isSub ? "subcategoría" : "categoría"}.
          </p>
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
