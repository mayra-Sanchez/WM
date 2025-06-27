import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faSearch,
  faBars,
  faTimes,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../Auth/AuthLayout/AuthLayout";
import ProductModal from "../Client/ProductModal";
import "./Navbar.css";
import logo from "../../assets/logo_wm.png";

const Navbar = () => {
  const [categorias, setCategorias] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [subOpen, setSubOpen] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchField, setSearchField] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/products/api/categories/");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/products/api/products/");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const toggleSearchBar = () => {
    setShowSearch((prev) => !prev);
    setSearchTerm("");
    setFilteredProducts([]);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const resultados = productos.filter((product) => {
      if (searchField === "name") {
        return product.name?.toLowerCase().includes(term);
      } else if (searchField === "color") {
        return product.variants?.some((variant) => variant.color?.toLowerCase().includes(term));
      } else if (searchField === "size") {
        return product.variants?.some((variant) =>
          variant.sizes?.some((size) => size.size?.toLowerCase().includes(term))
        );
      }
      return false;
    });

    setFilteredProducts(resultados);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleAuthModal = () => {
    if (menuOpen) setMenuOpen(false);
    setShowAuthModal((prev) => !prev);
  };

  const toggleSubMenu = (id) => {
    setSubOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goToCategory = (id) => {
    setMenuOpen(false);
    navigate(`/categoria/${id}`);
  };

  const goToSubcategory = (id) => {
    setMenuOpen(false);
    navigate(`/subcategoria/${id}`);
  };

  return (
    <header>
      <div className="top-bar">
        ENVÍOS GRATIS POR COMPRAS SUPERIORES A 200.000 COP
      </div>

      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}> <img src={logo} alt="Logo WM" /> </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>

        <ul className="navbar-menu desktop">
          <motion.li whileHover={{ scale: 1.1 }} onClick={() => navigate("/")}>INICIO</motion.li>
          {categorias.map((cat) => (
            <motion.li
              key={cat.id}
              className="category-item"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setSubOpen({ [cat.id]: true })}
              onMouseLeave={() => setSubOpen({ [cat.id]: false })}
            >
              <div className="category-header" onClick={() => goToCategory(cat.id)}>
                {cat.name.toUpperCase()} {cat.subcategories.length > 0 && (
                  <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                )}
              </div>
              {cat.subcategories.length > 0 && subOpen[cat.id] && (
                <ul className="subcategory-list">
                  {cat.subcategories.map((sub) => (
                    <li
                      key={sub.id}
                      className="subcategory-item"
                      onClick={() => goToSubcategory(sub.id)}
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          ))}
        </ul>

        <div className="navbar-icons" style={{ position: "relative" }}>
          {user ? (
            <div className="user-info">
              <span>Hola, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
            </div>
          ) : (
            <FontAwesomeIcon icon={faUser} className="icon" onClick={toggleAuthModal} />
          )}
          <FontAwesomeIcon icon={faShoppingCart} className="icon" />
          <FontAwesomeIcon icon={faSearch} className="icon" onClick={toggleSearchBar} />

          {showSearch && (
            <div className="search-bar-container">
              <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                <option value="nombre">Nombre</option>
                <option value="color">Color</option>
                <option value="talla">Talla</option>
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={`Buscar por ${searchField}...`}
              />
              {filteredProducts.length > 0 && (
                <div className="search-results">
                  {filteredProducts.map((product) => (
                    <p
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                        setShowSearch(false);
                      }}
                    >
                      {product.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.ul
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <li onClick={() => { setMenuOpen(false); navigate("/"); }}>INICIO</li>
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <div
                    className="category-header"
                    onClick={() => {
                      toggleSubMenu(cat.id);
                      goToCategory(cat.id);
                    }}
                  >
                    {cat.name.toUpperCase()} {cat.subcategories.length > 0 && (
                      <FontAwesomeIcon
                        icon={subOpen[cat.id] ? faChevronUp : faChevronDown}
                        className="dropdown-icon"
                      />
                    )}
                  </div>
                  {cat.subcategories.length > 0 && subOpen[cat.id] && (
                    <ul className="subcategory-list">
                      {cat.subcategories.map((sub) => (
                        <li
                          key={sub.id}
                          className="subcategory-item"
                          onClick={() => goToSubcategory(sub.id)}
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAuthModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AuthLayout onClose={toggleAuthModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={showProductModal}
            onClose={() => {
              setShowProductModal(false);
              setSelectedProduct(null);
            }}
            addToCart={(item) => {
              console.log("Agregar al carrito:", item);
              // Aquí conecta con tu lógica real de carrito
            }}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
