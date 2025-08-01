import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./Common/ProductCard";
import { useWishlist } from "../../contexts/WishlistContext";
import ProductModal from "./ProductModal";
import "./ProductsByType.css";

const ProductsByType = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaProductos, setCategoriaProductos] = useState([]);
  const [visibleCatProds, setVisibleCatProds] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { wishlist, add, remove } = useWishlist();

  const isSub = location.pathname.includes("/subcategoria/");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://wmsiteweb.xyz/products/api/categories/"),
          axios.get("https://wmsiteweb.xyz/products/api/products/"),
        ]);

        const idInt = parseInt(id);
        let nombreActual = "";
        let filtrados = [];
        let subcats = [];
        let parentProducts = [];

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
              if (sub.id === idInt && isSub) {
                nombreActual = sub.name;
                filtrados = prodRes.data.filter((p) => p.category === sub.id);
                parentProducts = prodRes.data.filter((p) => p.category === cat.id);
                subcats = cat.subcategories;
              }
            });
          }
        });

        setNombre(nombreActual);
        setProductos(filtrados);
        setCategoriaProductos(parentProducts);
        setSubcategorias(subcats);
        setVisibleCatProds(4);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchData();
  }, [id, location.pathname]);

  const getDiscountedVariant = (variants) => {
    return variants?.find((v) => parseFloat(v.discount) > 0) || variants?.[0];
  };

  return (
    <>
      <main className="products-container">
        <h2 className="category-title">
          {isSub ? "Subcategoría" : "Categoría"}: {nombre}
        </h2>

        {subcategorias.length > 0 && (
          <div className="subcategories-container">
            <p className="subcategories-title">Explora subcategorías:</p>
            <div className="subcategories-chips">
              {subcategorias.map((sub) => (
                <button
                  key={sub.id}
                  className={`subcategory-chip ${
                    parseInt(id) === sub.id ? "active" : ""
                  }`}
                  onClick={() => navigate(`/subcategoria/${sub.id}`)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isSub && categoriaProductos.length > 0 && (
          <div className="category-parent-products">
            <p className="parent-products-title">
              También puedes estar interesad@ en productos de la categoría:
            </p>
            <div className="product-grid">
              {categoriaProductos.slice(0, visibleCatProds).map((prod) => {
                const variant = getDiscountedVariant(prod.variants);
                return (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    variant={variant}
                    isInWishlist={wishlist.some((item) => item.product === prod.id)}
                    onToggleWishlist={(id) => {
                      const item = wishlist.find((i) => i.product === id);
                      item ? remove(item.id) : add(id);
                    }}
                    onClick={() => setSelectedProduct(prod)}
                  />
                );
              })}
            </div>
            {categoriaProductos.length > visibleCatProds && (
              <div className="centered-button">
                <button
                  className="load-more-btn"
                  onClick={() => setVisibleCatProds((prev) => prev + 4)}
                >
                  Ver más
                </button>
              </div>
            )}
          </div>
        )}

        {productos.length > 0 ? (
          <div className="product-grid">
            {productos.map((prod) => {
              const variant = getDiscountedVariant(prod.variants);
              return (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  variant={variant}
                  isInWishlist={wishlist.some((item) => item.product === prod.id)}
                  onToggleWishlist={(id) => {
                    const item = wishlist.find((i) => i.product === id);
                    item ? remove(item.id) : add(id);
                  }}
                  onClick={() => setSelectedProduct(prod)}
                />
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
    </>
  );
};

export default ProductsByType;
