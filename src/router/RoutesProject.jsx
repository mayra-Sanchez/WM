import { BrowserRouter, Route, Routes } from "react-router-dom";

import ClientLayout from "../layout/ClientLayout";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import AdminPanel from "../pages/Admin/AdminPanel";
import ProductsByType from "../components/Client/ProductsByType";
import Checkout from "../components/Checkout/Checkout";
import MyOrders from "../components/MyOrders/MyOrders";
import ProductDetail from "../components/Client/ProductDetail";

const RoutesProject = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas cliente */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:idSlug" element={<ProductDetail />} />
          <Route path="categoria/:id" element={<ProductsByType />} />
          <Route path="subcategoria/:id" element={<ProductsByType />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="my-orders" element={<MyOrders />} />
        </Route>

        {/* Rutas protegidas solo para admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPanel />} />
            {/* Agrega más rutas admin aquí */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesProject;
