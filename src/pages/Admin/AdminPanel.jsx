import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import AdminHeader from './components/AdminHeader';
// import AdminTabs from './components/AdminTabs';
// import UserManagement from './components/UserManagement';
// import ProductManagement from './components/ProductManagement';
// import Reports from './components/Reports';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('users');

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (!user || user.rol.toLowerCase() !== 'administrador') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user || user.rol.toLowerCase() !== 'administrador') {
    return null;
  }

  return (
    <div className="admin-container">
      {/* <AdminHeader user={user} onLogout={handleLogout} />
      <div className="admin-content">
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'reports' && <Reports />}
      </div> */}
    </div>
  );
};

export default AdminPanel;