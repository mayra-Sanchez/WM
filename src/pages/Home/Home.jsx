import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import FeaturesStrip from "../components/caracteristicas/FeaturesStrip";
import HeroVideo from "../components/video/HeroVideo";
import { getAllProducts, getAllCategories } from "../../services/products";
import "./Home.css";
import ProductoModal from "../components/modal/ProductoModal";

const Home = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getAllCategories();
      const prods = await getAllProducts();
      setCategorias(cats);
      setProductos(prods);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <HeroVideo />

      <div className="home-content">
        {categorias.map((cat) => (
          <div key={cat.id} className="categoria-section">
            <h2>{cat.name.toUpperCase()}</h2>
            <div className="productos-grid">
              {productos
                .filter((prod) => prod.category === cat.id)
                .map((prod) => {
                  const imagen = prod.variants[0]?.images[0]?.image;
                  return (
                    <div
                      key={prod.id}
                      className="producto-card"
                      onClick={() => setProductoSeleccionado(prod)}
                    >
                      {imagen && <img src={`http://localhost:8000${imagen}`} alt={prod.name} />}
                      <h3>{prod.name}</h3>
                      <p>${prod.price}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <FeaturesStrip />
      <Footer />

      {productoSeleccionado && (
        <ProductModal
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default Home;
