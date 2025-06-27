import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsappButton.css";

const WhatsappButton = () => {
  const whatsappNumber = "573106366464"; // Reemplaza con el tuyo
  const message = "Hola, quiero más información sobre sus productos.";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat en WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
};

export default WhatsappButton;
