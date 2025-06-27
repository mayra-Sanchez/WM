import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import AdminPanel from "../pages/Admin/AdminPanel";
import ProductsByType from "../components/Client/ProductsByType";

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
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesProject;
