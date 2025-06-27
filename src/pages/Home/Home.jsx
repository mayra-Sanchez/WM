import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import Footer from "../../components/Footer/Footer";
import FeaturesStrip from "../components/caracteristicas/FeaturesStrip";
import HeroVideo from "../components/video/HeroVideo";
import ProductCarousel from "../../components/Client/ProductCarousel";
import WhatsappButton from "../../components/Client/WhatsappButton";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroVideo />
      <ProductCarousel />
      <FeaturesStrip />
      <WhatsappButton />
      <Footer />
    </div>
  );
};

export default Home;
