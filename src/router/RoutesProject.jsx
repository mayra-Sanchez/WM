import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import AdminPanel from "../pages/Admin/AdminPanel";
import ProductsByType from "../components/Client/ProductsByType";
import Checkout from "../components/Checkout/Checkout";
import MyOrders from "../components/MyOrders/MyOrders";

const RoutesProject = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/categoria/:id" element={<ProductsByType />} />
        <Route path="/subcategoria/:id" element={<ProductsByType />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesProject;
