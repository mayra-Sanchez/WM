// AdminTabs.jsx
import React, { useState } from 'react';
import { FaUsers, FaBoxOpen, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import './AdminTabs.css';

const AdminTabs = ({ activeTab, setActiveTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // cerrar menú tras seleccionar
  };

  return (
    <div className="admin-tabs">
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`tab-list ${menuOpen ? 'open' : ''}`}>
        <div
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleSelect('users')}
        >
          <FaUsers className="tab-icon" />
          <span>Usuarios</span>
        </div>

        <div
          className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleSelect('categories')}
        >
          <BiSolidCategory className="tab-icon" />
          <span>Categorías</span>
        </div>

        <div
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleSelect('products')}
        >
          <FaBoxOpen className="tab-icon" />
          <span>Productos</span>
        </div>

        <div
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleSelect('orders')}
        >
          <IoDocumentTextOutline className="tab-icon" />
          <span>Ordenes</span>
        </div>

        <div
          className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => handleSelect('reports')}
        >
          <FaChartBar className="tab-icon" />
          <span>Reportes</span>
        </div>
      </div>
    </div>
  );
};

export default AdminTabs;
