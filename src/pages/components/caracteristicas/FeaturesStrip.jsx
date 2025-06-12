import { ShieldAlert } from "lucide-react"; // Puedes cambiar el ícono
import "./FeaturesStrip.css";

export default function FeaturesStrip() {
  const features = [
    "Envíos nacionales gratuitos por compras superiores a $200.000",
    "Cada prenda fue hecha para entrenamientos de alta intensidad",
    "Producto 100% Caleño.",
  ];

  return (
    <div className="features-strip">
      {features.map((text, index) => (
        <div className="feature-item" key={index}>
          <ShieldAlert color="#e63946" size={28} />
          <p>{text}</p>
        </div>
      ))}
    </div>
  );
}
