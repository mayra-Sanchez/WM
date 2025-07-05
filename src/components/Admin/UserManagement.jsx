import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaWhatsapp, FaSyncAlt, FaSearch } from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    if (token) {
      fetchUsers();
    } else {
      alert("No hay token disponible. Inicia sesión.");
      setLoading(false);
    }
  }, [token]);

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}?subject=Info%20de%20la%20tienda&body=Hola,%20tenemos%20novedades%20para%20ti.`;
  };

  const handleSendWhatsApp = (phone) => {
    const msg = encodeURIComponent("Hola, tenemos novedades en nuestra tienda que te pueden interesar.");
    window.open(`https://wa.me/57${phone}?text=${msg}`, "_blank");
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-panel-container">
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

      {loading ? (
        <div className="loading-text">Cargando usuarios...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users-text">No se encontraron usuarios.</div>
      ) : (
        <div className="user-grid">
          {filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-header">
                <h3>{user.name} {user.last_name}</h3>
                <span className="user-role">{user.role}</span>
              </div>
              <div className="user-details">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Correo:</strong> {user.email}</p>
                <p><strong>Teléfono:</strong> {user.phone_number}</p>
              </div>
              <div className="user-actions">
                <button onClick={() => handleSendEmail(user.email)} title="Enviar correo" className="btn-email">
                  <FaEnvelope />
                </button>
                <button onClick={() => handleSendWhatsApp(user.phone_number)} title="Enviar WhatsApp" className="btn-whatsapp">
                  <FaWhatsapp />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
