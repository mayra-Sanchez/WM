import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Admin/Header/AdminHeader';
import AdminTabs from '../../components/Admin/Tabs/AdminTabs';
import UserManagement from '../../components/Admin/UserManagement';
import ProductManagement from '../../components/Admin/ProductManagement';
import Reports from '../../components/Admin/Reports';
import './AdminPanel.css';
import Categories from '../../components/Admin/Categories';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-panel">
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-body">
        <AdminHeader user={user} onLogout={handleLogout} />
        <h2 className="dashboard-title">
          Panel de Administración
        </h2>
        <div className="admin-content">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'categories' && <Categories />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
