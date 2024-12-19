import { Routes, Route } from "react-router-dom"
import LandingPage from "../pages/Landing/LandingPage";
import Signup from "../auth/Signup/Signup";
import Login from "../auth/Login/Login";
import ContactPage from "../pages/Contact/ContactPage";
import Products from "../pages/Products/Products";
import Order from "../pages/Order/Order";
import OrderSuccess from "../pages/Order/OrderSuccess";

const AllRoutes = () => {
    return (
        <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
    )
}

export default AllRoutes;