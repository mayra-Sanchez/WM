import React from 'react';
import './AdminHeader.css';

const AdminHeader = ({ user, onLogout }) => {
  return (
    <div className="admin-header">
      <div className="user-info">Bienvenido, {user?.nombre || 'Admin'}</div>
      <button className="logout-button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default AdminHeader;
