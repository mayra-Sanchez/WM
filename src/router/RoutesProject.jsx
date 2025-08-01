// src/router/RoutesProject.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ClientLayout from "../layout/ClientLayout";
import AdminLayout from "../layout/AdminLayout";

import Home from "../pages/Home/Home";
import AdminPanel from "../pages/Admin/AdminPanel";
import ProductsByType from "../components/Client/ProductsByType";
import Checkout from "../components/Checkout/Checkout";
import MyOrders from "../components/MyOrders/MyOrders";

const RoutesProject = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas cliente */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="categoria/:id" element={<ProductsByType />} />
          <Route path="subcategoria/:id" element={<ProductsByType />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="my-orders" element={<MyOrders />} />
        </Route>

        {/* Rutas admin */}
        <Route path="/dashboard/" element={<AdminLayout />}>
          <Route index element={<AdminPanel />} />
          {/* Aquí puedes agregar más rutas admin si tienes */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default RoutesProject;
