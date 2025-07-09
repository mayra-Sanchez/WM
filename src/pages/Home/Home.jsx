import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import Footer from "../../components/Footer/Footer";
import FeaturesStrip from "../components/caracteristicas/FeaturesStrip";
import HeroVideo from "../components/video/HeroVideo";
import ProductCarousel from "../../components/Client/ProductCarousel";
import WhatsappButton from "../../components/Client/WhatsappButton";
import './../../components/Navbar/Navbar.css'

const Home = () => {
  return (
    <div>
      <div className="page-content fullscreen-home">
        <HeroVideo />
      </div>
      <ProductCarousel />
      <FeaturesStrip />
      <WhatsappButton />
    </div>
  );
};

export default Home;
