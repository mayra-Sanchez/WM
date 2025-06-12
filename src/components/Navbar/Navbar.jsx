import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../Auth/AuthLayout/AuthLayout";
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

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/categorias");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleAuthModal = () => {
    // Cierra el menú móvil si está abierto
    if (menuOpen) setMenuOpen(false);
    // Alterna la visibilidad del modal
    setShowAuthModal(prev => !prev);
  };

  return (
    <header>
      <div className="top-bar">
        ENVÍOS GRATIS POR COMPRAS SUPERIORES A 200.000 COP
      </div>

      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo WM" />
        </div>

        {/* Ícono hamburguesa (visible solo en móvil) */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>

        {/* Menú principal */}
        <ul className="navbar-menu desktop">
          <motion.li whileHover={{ scale: 1.1 }}>INICIO</motion.li>
          {categorias.map((cat) => (
            <motion.li key={cat.id} whileHover={{ scale: 1.1 }}>
              {cat.nombre.toUpperCase()}
            </motion.li>
          ))}
        </ul>

        {/* Iconos */}
        <div className="navbar-icons">
          {user ? (
            <div className="user-info">
              <span>Hola, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="icon"
              onClick={toggleAuthModal}
            />
          )}
          <FontAwesomeIcon icon={faShoppingCart} className="icon" />
          <FontAwesomeIcon icon={faSearch} className="icon" />
        </div>
      </nav>

      {/* Menú móvil */}
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
              <li onClick={() => setMenuOpen(false)}>INICIO</li>
              {categorias.map((cat) => (
                <li key={cat.id} onClick={() => setMenuOpen(false)}>
                  {cat.nombre.toUpperCase()}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Login/Registro */}
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
    </header>
  );
};

export default Navbar;
