import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  FaEnvelope, 
  FaWhatsapp, 
  FaSyncAlt, 
  FaSearch, 
  FaUsers, 
  FaEye,
  FaFilter,
  FaUserEdit,
  FaUserShield
} from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [massMessage, setMassMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("all");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  
  const usersPerPage = 10;
  const token = localStorage.getItem("accessToken");

  const roles = [
    { value: "all", label: "Todos los roles" },
    { value: "admin", label: "Administradores" },
    { value: "cliente", label: "Usuarios normales" }
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://wmsiteweb.xyz/users/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      if (error.response?.status === 401) {
        alert("No autorizado. Inicia sesión como admin.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchUsers();
  }, [fetchUsers, token]);

  useEffect(() => {
    let result = users;
    
    // Filtrar por búsqueda
    if (search) {
      result = result.filter((u) =>
        `${u.name} ${u.last_name} ${u.email} ${u.phone_number}`.toLowerCase()
        .includes(search.toLowerCase())
      );
    }
    
    // Filtrar por rol
    if (selectedRole !== "all") {
      result = result.filter((u) => u.role === selectedRole);
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Resetear a primera página al filtrar
  }, [search, selectedRole, users]);

  const handleSendEmail = (email, message) => {
    const subject = encodeURIComponent("Información importante");
    const body = encodeURIComponent(message || "Hola, tenemos novedades para ti.");
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleSendWhatsApp = (phone, message) => {
    if (!phone) return alert("El usuario no tiene número registrado");
    const msg = encodeURIComponent(message || "Hola, tenemos novedades que te pueden interesar.");
    window.open(`https://wa.me/57${phone}?text=${msg}`, "_blank");
  };

  const handleMassAction = (type) => {
    if (!massMessage.trim()) {
      return alert("Ingresa un mensaje para enviar.");
    }
    
    if (filteredUsers.length === 0) {
      return alert("No hay usuarios para enviar el mensaje.");
    }
    
    setActionType(type);
    setShowConfirmation(true);
  };

  const confirmMassAction = () => {
    if (actionType === "whatsapp") {
      filteredUsers.forEach((user, i) => {
        setTimeout(() => handleSendWhatsApp(user.phone_number, massMessage), i * 1500);
      });
    } else {
      filteredUsers.forEach((user, i) => {
        setTimeout(() => handleSendEmail(user.email, massMessage), i * 1500);
      });
    }
    setShowConfirmation(false);
  };

  const confirmRoleChange = async () => {
    try {
      await axios.patch(
        `https://wmsiteweb.xyz/users/api/users/${selectedUser.id}/`,
        { role: selectedUser.newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
      alert("Rol actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      alert("Error al actualizar rol");
    } finally {
      setShowConfirmation(false);
    }
  };

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="user-management-container">
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon total-users">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Total Usuarios</h3>
            <p>{users.length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon filtered-users">
            <FaEye />
          </div>
          <div className="card-content">
            <h3>Filtrados</h3>
            <p>{filteredUsers.length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon admins">
            <FaUserShield />
          </div>
          <div className="card-content">
            <h3>Administradores</h3>
            <p>{users.filter(u => u.role === 'admin').length}</p>
          </div>
        </div>
      </div>

      <div className="panel-header">
        
        <div className="controls">
          <div className="search-filter-container">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdown">
              <FaFilter />
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            className="refresh-btn" 
            onClick={fetchUsers} 
            title="Recargar usuarios"
          >
            <FaSyncAlt /> Actualizar
          </button>
        </div>
      </div>

      <div className="mass-message-section">
        <h3>Mensaje Masivo</h3>
        <textarea
          placeholder="Escribe un mensaje para enviar a todos los usuarios filtrados..."
          value={massMessage}
          onChange={(e) => setMassMessage(e.target.value)}
          rows={4}
        />
        <div className="mass-actions">
          <button 
            className="whatsapp-btn" 
            onClick={() => handleMassAction("whatsapp")}
          >
            <FaWhatsapp /> Enviar WhatsApp
          </button>
          <button 
            className="email-btn" 
            onClick={() => handleMassAction("email")}
          >
            <FaEnvelope /> Enviar Correo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron usuarios con los filtros actuales.</p>
          <button 
            onClick={() => {
              setSearch("");
              setSelectedRole("all");
            }}
            className="reset-filters-btn"
          >
            Reiniciar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number || 'No registrado'}</td>
                    <td>
                      {user.role || 'No registrado'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleSendEmail(user.email)}
                          className="action-btn email"
                          title="Enviar correo"
                        >
                          <FaEnvelope />
                        </button>
                        <button 
                          onClick={() => handleSendWhatsApp(user.phone_number)}
                          className="action-btn whatsapp"
                          title="Enviar WhatsApp"
                          disabled={!user.phone_number}
                        >
                          <FaWhatsapp />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination-container">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Anterior
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`page-btn ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirmar acción</h3>
            <p>
              {actionType === "changeRole" 
                ? `¿Estás seguro de cambiar el rol del usuario a ${selectedUser.newRole}?`
                : `¿Estás seguro de enviar este mensaje a ${filteredUsers.length} usuario(s)?`}
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowConfirmation(false)}
                className="cancel-btn"
              >
                Cancelar
              </button>
              <button 
                onClick={actionType === "changeRole" ? confirmRoleChange : confirmMassAction}
                className="confirm-btn"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;