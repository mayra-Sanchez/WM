import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import './Checkout.css';
import OrderSummary from "./OderSummary";

const Checkout = () => {
    return(
        <div>
            <Navbar />
            <div className="checkout">
                <OrderSummary />
            </div>
           <Footer />
        </div>
    );
};

export default Checkout;