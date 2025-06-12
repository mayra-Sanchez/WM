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
import { faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";

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
        <div className="footer-column">
          <p>
            <FontAwesomeIcon icon={faWhatsapp} /> +57 321 877 5416
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} /> wm.benchmarking@gmail.com
          </p>
          <p>
            <FontAwesomeIcon icon={faLocationDot} /> Cali, Colombia.
          </p>
          <div className="payment-section">
            <p>Aceptamos:</p>
            <div className="payment-icons">
              <FontAwesomeIcon icon={faCcVisa} />
              <FontAwesomeIcon icon={faCcMastercard} />
              <FontAwesomeIcon icon={faCcAmex} />
              <FontAwesomeIcon icon={faCcPaypal} />
            </div>
          </div>
        </div>

        <div className="footer-column right">
          <ul>
            <li>
              <span
                className="footer-link"
                onClick={() => openModal("quienes")}
              >
                ¿Quiénes somos?
              </span>
            </li>
            <li>
              <span className="footer-link" onClick={() => openModal("mision")}>
                Misión
              </span>
            </li>
            <li>
              <span className="footer-link" onClick={() => openModal("vision")}>
                Visión
              </span>
            </li>
          </ul>

          <div className="footer-socials">
            <a
              href="https://facebook.com/wmsport"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://tiktok.com/@wmsport"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a
              href="https://instagram.com/wmsport"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
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
