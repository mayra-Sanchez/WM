import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import {
  faUser,
  faShoppingCart,
  faSearch,
  faBars,
  faTimes,
  faChevronDown,
  faChevronUp,
  faBoxOpen,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../Auth/AuthLayout/AuthLayout";
import ProductModal from "../Client/ProductModal";
import "./Navbar.css";
import logo from "../../assets/logo_wm.png";
import CartDropdown from "./components/CartDropDown";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import WishlistDropdown from "./components/WishlistDropDown";
import SearchBar from "./components/SearchBar";

const Navbar = () => {
  const [categorias, setCategorias] = useState([]);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [subOpen, setSubOpen] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchField, setSearchField] = useState("name");
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const { cartItems } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userDropdownRef = useRef(null);


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
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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
    if (!showSearch) {
      setSearchTerm("");
      setFilteredProducts([]);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);

    if (!term) {
      setFilteredProducts([]);
      return;
    }

    const resultados = productos.filter((product) => {
      const searchTermLower = term.toLowerCase();

      if (searchField === "name") {
        return product.name?.toLowerCase().includes(searchTermLower);
      } else if (searchField === "color") {
        return product.variants?.some(variant =>
          variant.color?.toLowerCase().includes(searchTermLower)
        );
      } else if (searchField === "size") {
        return product.variants?.some(variant =>
          variant.sizes?.some(size =>
            size.size?.toLowerCase().includes(searchTermLower)
          )
        );
      }
      return false;
    });

    setFilteredProducts(resultados);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowCart(false);
    setShowSearch(false);
    setSearchTerm('');
    setFilteredProducts([]);
    setSelectedProduct(null);
    setShowProductModal(false);
    setMenuOpen(false);
    setSubOpen({});

    localStorage.removeItem('access');
    sessionStorage.clear();

    navigate('/');

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.location.reload();
    }, 300);
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

  const toggleCart = () => setShowCart(!showCart);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    setShowSearch(false);
  };

  return (
    <header>
      <div className="top-bar">
        ENVÍOS GRATIS POR COMPRAS SUPERIORES A 200.000 COP
      </div>

      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo WM" />
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>

        <ul className="navbar-menu desktop">
          <div className="category-header">
            <motion.li whileHover={{ scale: 1.1 }} onClick={() => navigate("/")}>
              INICIO
            </motion.li>
          </div>
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

        <div className="navbar-icons">
          {/* Usuario logueado o login */}
          {user ? (
            <div
              className="icon-item user-dropdown-wrapper"
              ref={userDropdownRef}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FontAwesomeIcon icon={faUser} className="icon" />
              <span className="user-greeting hide-on-mobile">Hola, {user.name}</span>
              <FontAwesomeIcon icon={showUserMenu ? faChevronUp : faChevronDown} className="dropdown-icon hide-on-mobile" />

              <AnimatePresence>
                {showUserMenu && (
                  <motion.ul
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <li onClick={() => { navigate("/my-orders"); setShowUserMenu(false); }}>
                      <FontAwesomeIcon icon={faBoxOpen} className="dropdown-icon-left" />
                      Mis pedidos
                    </li>
                    <li onClick={() => { handleLogout(); setShowUserMenu(false); }}>
                      <FontAwesomeIcon icon={faRightFromBracket} className="dropdown-icon-left" />
                      Cerrar sesión
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>

            </div>
          ) : (
            <FontAwesomeIcon icon={faUser} className="icon" onClick={toggleAuthModal} />
          )}

          {/* Carrito */}
          <div className="icon-with-badge" onClick={toggleCart}>
            <FontAwesomeIcon icon={faShoppingCart} className="icon" />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </div>

          {/* Wishlist */}
          <WishlistDropdown />

          {/* Buscar */}
          <FontAwesomeIcon
            icon={faSearch}
            className="icon"
            onClick={toggleSearchBar}
          />

          {/* Barra de búsqueda activa */}
          {showSearch && (
            <SearchBar
              searchField={searchField}
              setSearchField={setSearchField}
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
              filteredProducts={filteredProducts}
              onResultClick={(product) => {
                setSelectedProduct(product);
                setShowProductModal(true);
                setShowSearch(false);
              }}
              isActive={showSearch}
              onClose={() => setShowSearch(false)}
            />
          )}
        </div>

      </nav>

      {/* Resto del código permanece igual */}
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

              <li onClick={() => { setMenuOpen(false); navigate("/"); }}>
                <div className="category-header">
                  INICIO
                </div>

              </li>



              {categorias.map((cat) => (
                <li key={cat.id}>
                  <div
                    className="category-header"
                    onClick={() => toggleSubMenu(cat.id)}
                  >
                    {cat.name.toUpperCase()}{" "}
                    {cat.subcategories.length > 0 && (
                      <FontAwesomeIcon
                        icon={subOpen[cat.id] ? faChevronUp : faChevronDown}
                        className="dropdown-icon"
                      />
                    )}
                  </div>

                  {cat.subcategories.length > 0 && subOpen[cat.id] && (
                    <ul className="subcategory-list">
                      <li
                        className="subcategory-item"
                        onClick={() => {
                          goToCategory(cat.id);
                          setMenuOpen(false);
                        }}
                      >
                        Ver todo
                      </li>
                      {cat.subcategories.map((sub) => (
                        <li
                          key={sub.id}
                          className="subcategory-item"
                          onClick={() => {
                            goToSubcategory(sub.id);
                            setMenuOpen(false);
                          }}
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
            onClose={() => setShowProductModal(false)}
          />
        )}
      </AnimatePresence>

      <CartDropdown isOpen={showCart} onClose={toggleCart} />
    </header>
  );
};

export default Navbar;