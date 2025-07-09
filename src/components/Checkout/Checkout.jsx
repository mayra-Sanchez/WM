import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import './Checkout.css';
import OrderSummary from "./OderSummary";

const Checkout = () => {
    return(
        <div>
            <div className="checkout">
                <OrderSummary />
            </div>
        </div>
    );
};

export default Checkout;