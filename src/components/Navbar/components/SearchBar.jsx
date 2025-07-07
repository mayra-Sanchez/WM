import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import "./SearchBar.css";

const SearchBar = ({
  searchField,
  setSearchField,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  onResultClick,
  isActive,
  onClose,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredProducts.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          if (highlightedIndex >= 0 && filteredProducts[highlightedIndex]) {
            handleProductClick(filteredProducts[highlightedIndex]);
          }
          break;
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, filteredProducts, highlightedIndex, onClose]);

  // Auto-focus al abrir
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleProductClick = (product) => {
    onResultClick(product);
    onClose();
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="search-bar-container"
          ref={containerRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            aria-label="Campo de búsqueda"
            className="search-select"
          >
            <option value="name">Nombre</option>
            <option value="color">Color</option>
            <option value="size">Talla</option>
          </select>

          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder={`Buscar por ${searchField === "name" ? "nombre" : searchField}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={inputRef}
              aria-label="Barra de búsqueda"
            />
          </div>

          {filteredProducts.length > 0 ? (
            <motion.div 
              className="search-results"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={`search-result-item ${
                    highlightedIndex === index ? "highlighted" : ""
                  }`}
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="product-name">{product.name}</span>
                  {product.variants?.[0]?.color && (
                    <span className="product-color">{product.variants[0].color}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : searchTerm ? (
            <div className="no-results">
              No se encontraron resultados para "{searchTerm}"
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;