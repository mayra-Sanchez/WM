import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.css";

const SearchBar = ({
  searchField,
  setSearchField,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  onResultClick,
}) => {
  return (
    <div className="search-bar-container">
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="nombre">Nombre</option>
        <option value="color">Color</option>
        <option value="talla">Talla</option>
      </select>

      <div className="search-bar-input-group">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder={`Buscar por ${searchField}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 && (
        <div className="search-results">
          {filteredProducts.map((product) => (
            <p
              key={product.id}
              onClick={() => onResultClick(product)}
            >
              {product.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
