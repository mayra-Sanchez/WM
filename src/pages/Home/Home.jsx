import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import Footer from "../../components/Footer/Footer";
import FeaturesStrip from "../components/caracteristicas/FeaturesStrip";
import HeroVideo from "../components/video/HeroVideo";
import ProductCarousel from "../../components/Client/ProductCarousel";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroVideo />
      <ProductCarousel />
      <FeaturesStrip />
      <Footer />
    </div>
  );
};

export default Home;
