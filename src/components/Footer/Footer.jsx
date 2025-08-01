import React, { useState } from "react";
import InfoModal from "./Modal/InfoModal";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faFacebook,
  faInstagram,
  faTiktok,
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcPaypal,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLocationDot, faHeart } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [modalData, setModalData] = useState(null);

  const openModal = (type) => {
    switch (type) {
      case "quienes":
        setModalData({
          title: "¿<span>Quiénes somos</span>?",
          content:
            "WM Sport es una marca colombiana comprometida con la creación de ropa deportiva de alto rendimiento. Nuestro objetivo es impulsar el potencial de cada atleta con productos funcionales, duraderos y con identidad local.",
        });
        break;
      case "mision":
        setModalData({
          title: "MISI<span>Ó</span>N",
          content:
            "Nuestro compromiso es empoderar a deportistas de todo el mundo, ofreciéndoles prendas que se adaptan a sus necesidades, maximizan su desempeño y reflejan su pasión por el deporte. Creemos en la inclusión, la diversidad y el poder transformador del deporte para unir a las personas y cambiar vidas.",
        });
        break;
      case "vision":
        setModalData({
          title: "VISI<span>Ó</span>N",
          content:
            "Ser la marca líder en ropa deportiva a nivel global, reconocida por combinar diseño, innovación y sostenibilidad para inspirar a cada atleta y amante del deporte, sin importar su nivel, a alcanzar su máximo potencial. Creemos que el deporte es para todos, desde quienes dan sus primeros pasos hasta los campeones que conquistan podios.",
        });
        break;
    }
  };

  const closeModal = () => setModalData(null);

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3 className="footer-title">Contacto</h3>
            <div className="contact-info">
              <p>
                <FontAwesomeIcon icon={faWhatsapp} className="contact-icon" /> 
                <a href="https://wa.me/573106366464" target="_blank" rel="noopener noreferrer">
                  +57 310 636 6464
                </a>
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> 
                <a href="mailto:wm.benchmarking@gmail.com">
                  wm.benchmarking@gmail.com
                </a>
              </p>
              <p>
                <FontAwesomeIcon icon={faLocationDot} className="contact-icon" /> 
                Cali, Colombia
              </p>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Empresa</h3>
            <ul className="footer-links">
              <li>
                <button className="footer-link" onClick={() => openModal("quienes")}>
                  ¿Quiénes somos?
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => openModal("mision")}>
                  Misión
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => openModal("vision")}>
                  Visión
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Métodos de pago</h3>
            <div className="payment-icons">
              <FontAwesomeIcon icon={faCcVisa} className="payment-icon" />
              <FontAwesomeIcon icon={faCcMastercard} className="payment-icon" />
              <FontAwesomeIcon icon={faCcAmex} className="payment-icon" />
              <FontAwesomeIcon icon={faCcPaypal} className="payment-icon" />
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Síguenos</h3>
            <div className="footer-socials">
              <a
                href="https://www.facebook.com/profile.php?id=61562943503117"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="social-icon" />
              </a>
              <a
                href="https://www.tiktok.com/@wm.sportswear"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} className="social-icon" />
              </a>
              <a
                href="https://www.instagram.com/wm__sportswear"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="social-icon" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} WM Sport. Todos los derechos reservados.
          </p>
          <p className="credits">
            Hecho con <FontAwesomeIcon icon={faHeart} className="heart-icon" /> por{" "}
            <a href="https://ovonix.com" target="_blank" rel="noopener noreferrer" className="ovonix-link">
              Ovonix Startup
            </a>, Cali, Colombia
          </p>
        </div>
      </footer>

      {modalData && (
        <InfoModal
          title={modalData.title}
          content={modalData.content}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Footer;