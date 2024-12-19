import React from "react";
import { Routes, Route } from "react-router-dom";
import AddCategory from "./AddCategory";
import AddProduct from "./AddProduct";
import Category from "./Category";
import Home from "./Home";
import Layout from "./Layout";
import Login from "./Login";
import Product from "./Product";
import ProductDetails from "./ProductDetails";
import ViewProduct from "./ViewProduct";
import Orders from "./Order";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/productdetail/:slug" element={<ProductDetails />} />
          <Route path="/category" element={<Category />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/category/:slug" element={<ViewProduct />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AllRoutes;
