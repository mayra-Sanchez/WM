import React from 'react';
import { FaUsers, FaBoxOpen, FaChartBar } from 'react-icons/fa';
import { BiSolidCategory } from "react-icons/bi";
import './AdminTabs.css';

const AdminTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="admin-tabs">
      <div
        className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        <FaUsers className="tab-icon" />
        <span>Usuarios</span>
      </div>

      <div
        className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
        onClick={() => setActiveTab('categories')}
      >
        <BiSolidCategory  className="tab-icon" />
        <span>Categorías</span>
      </div>

      <div
        className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
        onClick={() => setActiveTab('products')}
      >
        <FaBoxOpen className="tab-icon" />
        <span>Productos</span>
      </div>

      <div
        className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
        onClick={() => setActiveTab('reports')}
      >
        <FaChartBar className="tab-icon" />
        <span>Reportes</span>
      </div>
      
    </div>
  );
};

export default AdminTabs;
