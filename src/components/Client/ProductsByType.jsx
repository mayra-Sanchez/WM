import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ProductModal from "./ProductModal";
import "./ProductsByType.css"; // Asegúrate de tener estilos

const ProductsByType = () => {
  const { id } = useParams();
  const location = useLocation();
  const isSub = location.pathname.includes("/subcategoria/");
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/products/api/categories/"),
          axios.get("http://127.0.0.1:8000/products/api/products/"),
        ]);

        let nombreActual = "";
        let filtrados = [];

        catRes.data.forEach((cat) => {
          if (!isSub && cat.id === parseInt(id)) {
            nombreActual = cat.name;
            filtrados = prodRes.data.filter((p) => p.category === cat.id);
          } else {
            cat.subcategories.forEach((sub) => {
              if (sub.id === parseInt(id)) {
                nombreActual = sub.name;
                filtrados = prodRes.data.filter((p) => p.subcategory === sub.id);
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
  }, [id, isSub]);

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
