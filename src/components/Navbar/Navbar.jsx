import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import logo from '../../assets/logo_wm.png'

const Navbar = () => {
    const [categorias, setCategorias] = useState([]);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categorias');
                setCategorias(response.data);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
            }
        };

        fetchCategorias();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
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
                    {categorias.map(cat => (
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
                            <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
                        </div>
                    ) : (
                        <FontAwesomeIcon icon={faUser} className="icon" />
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
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <li onClick={() => setMenuOpen(false)}>INICIO</li>
                            {categorias.map(cat => (
                                <li key={cat.id} onClick={() => setMenuOpen(false)}>
                                    {cat.nombre.toUpperCase()}
                                </li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    );
};

export default Navbar;
