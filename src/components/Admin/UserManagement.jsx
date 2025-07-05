import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaWhatsapp, FaSyncAlt, FaSearch, FaUsers, FaEye } from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [massMessage, setMassMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const token = localStorage.getItem("accessToken");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/users/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      if (error.response?.status === 401) {
        alert("No autorizado. Inicia sesión como admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUsers();
  }, []);

  const handleSendEmail = (email, message) => {
    const subject = encodeURIComponent("Info de la tienda");
    const body = encodeURIComponent(message || "Hola, tenemos novedades para ti en nuestra tienda wm.");
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleSendWhatsApp = (phone, message) => {
    const msg = encodeURIComponent(message || "Hola, tenemos novedades en nuestra tienda wm que te pueden interesar.");
    window.open(`https://wa.me/57${phone}?text=${msg}`, "_blank");
  };

  const handleSendMassWhatsApp = () => {
    if (!massMessage.trim()) return alert("Ingresa un mensaje para enviar por WhatsApp.");
    filteredUsers.forEach((user, i) => {
      setTimeout(() => handleSendWhatsApp(user.phone_number, massMessage), i * 1500);
    });
  };

  const handleSendMassEmail = () => {
    if (!massMessage.trim()) return alert("Ingresa un mensaje para enviar por correo.");
    filteredUsers.forEach((user, i) => {
      setTimeout(() => handleSendEmail(user.email, massMessage), i * 1500);
    });
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-panel-container">
      <div className="summary-bar">
        <div className="summary-item">
          <FaUsers className="summary-icon" />
          <span><strong>Total usuarios:</strong> {users.length}</span>
        </div>
        <div className="summary-item">
          <FaEye className="summary-icon" />
          <span><strong>Mostrando:</strong> {filteredUsers.length}</span>
        </div>
      </div>

      <div className="panel-header">
        <h2 className="panel-title">Usuarios Registrados</h2>
        <div className="actions">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="refresh-btn" onClick={fetchUsers} title="Recargar">
            <FaSyncAlt />
          </button>
        </div>
      </div>

      <div className="mass-message-box">
        <textarea
          placeholder="Mensaje masivo para correo y WhatsApp..."
          value={massMessage}
          onChange={(e) => setMassMessage(e.target.value)}
        />
        <div className="mass-message-actions">
          <button className="mass-send-btn" onClick={handleSendMassWhatsApp}>
            <FaWhatsapp /> WhatsApp a todos
          </button>
          <button className="mass-send-btn" onClick={handleSendMassEmail}>
            <FaEnvelope /> Correo a todos
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-text">Cargando usuarios...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users-text">No se encontraron usuarios.</div>
      ) : (
        <div className="table-container">
          <table className="user-table">
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
                  <td>{user.phone_number}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleSendEmail(user.email)} title="Correo" className="btn-email">
                      <FaEnvelope />
                    </button>
                    <button onClick={() => handleSendWhatsApp(user.phone_number)} title="WhatsApp" className="btn-whatsapp">
                      <FaWhatsapp />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
