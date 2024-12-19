import React, { useState, useEffect } from "react";
import "./Products.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useCart } from "../../Context/CartContext";
import { useTheme } from "../../Context/ThemeContext";
import SecurityIcon from "@mui/icons-material/Security";
import { Tooltip, Snackbar, Alert } from "@mui/material";
import { api } from "../../api/config";

const Products = () => {
  const { addToCart, error, successMessage, clearMessages } = useCart();
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productItems, setProductItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // const categories = [
  //   { id: "all", name: "All Products" },
  //   { id: "cameras", name: "Security Cameras" },
  //   { id: "alarms", name: "Alarm Systems" },
  //   { id: "trackers", name: "GPS Trackers" },
  // ];

  const fetchProducts = async () => {
    const response = await api.get("/products");
    setProductItems(response.data.products);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      console.log(response.data);
      // Add "All" category at the beginning of the list
      setCategories([{ _id: "all", name: "All Products" }, ...response.data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized error without redirect
        setCategories([{ _id: "all", name: "All Products" }]);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? productItems
      : productItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    });
  };

  return (
    <div className={`products-wrapper ${isDarkMode ? "dark-mode" : ""}`}>
      <Navbar />
      <div className="products-hero">
        <div className="products-hero-content">
          <SecurityIcon className="hero-icon" />
          <h1>Security Solutions</h1>
          <p>Advanced technology for your peace of mind</p>
        </div>
      </div>

      <div className="products-page">
        <div className="products-header">
          <h2 style={{ textAlign: "center" }}>Our Products</h2>
          <p style={{ textAlign: "center" }}>
            Discover our range of cutting-edge security solutions
          </p>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category._id}
                className={`category-btn ${selectedCategory === category._id ? "active" : ""
                  }`}
                onClick={() => setSelectedCategory(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid-container">
          {filteredProducts.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="product-image"
                />
                {item.isNew && <span className="new-badge">New</span>}
              </div>
              <div className="product-details">
                <h3 className="product-title">{item.name}</h3>
                <p className="product-description">{item.description}</p>
                <div className="product-features">
                  {item.features.map((feature, index) => (
                    <Tooltip key={index} title={feature} arrow>
                      <span className="feature-badge">
                        {feature.length > 20
                          ? `${feature.substring(0, 20)}...`
                          : feature}
                      </span>
                    </Tooltip>
                  ))}
                </div>
                <div className="product-action">
                  <span className="product-price">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <SecurityIcon className="no-products-icon" />
          <h3>No products found</h3>
          <p>Try selecting a different category</p>
        </div>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={clearMessages}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={clearMessages} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={clearMessages}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={clearMessages} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Products;
