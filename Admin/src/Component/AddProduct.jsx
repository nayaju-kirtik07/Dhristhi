import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorToster, SuccessToster } from "./Toster";
import { FaTag, FaBoxOpen, FaImage, FaList } from 'react-icons/fa';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const initialData = {
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    imageUrl: "",
    stock: "",
    features: [],
    specifications: "",
    status: "active"
  };

  const [data, setData] = useState(initialData);
  const [feature, setFeature] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureAdd = () => {
    if (feature.trim()) {
      setData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
      setFeature("");
    }
  };

  const handleFeatureRemove = (index) => {
    setData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-product`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccessMessage("Product added successfully!");
      setShow(true);
      setData(initialData);
      setTimeout(() => navigate("/product"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error adding product");
      setShow(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCategories(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error fetching categories");
      setShow(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="add-product-container">
      <div className="add-product-header">
        <h2><FaBoxOpen className="header-icon" /> Add New Product</h2>
        <p>Create a new product listing</p>
      </div>

      {successMessage && <SuccessToster message={successMessage} show={show} setShow={setShow} position="top-right" />}
      {errorMessage && <ErrorToster message={errorMessage} show={show} setShow={setShow} position="top-right" />}

      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Product Name */}
        <div className="form-section">
          <h4><FaTag className="section-icon" /> Basic Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
          </div>

          {/* Price and Discount Price Row */}
          <div className="form-row">
            <div className="form-group half">
              <label>Regular Price (NRs)</label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group half">
              <label>Discount Price (NRs)</label>
              <input
                type="number"
                name="discount_price"
                value={data.discount_price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category and Stock Row */}
          <div className="form-row">
            <div className="form-group half">
              <label>Category</label>
              <select
                className="form-control input-field"
                id="category"
                name="category"
                value={data.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group half">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={data.stock}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="form-section">
          <h4><FaList className="section-icon" /> Product Details</h4>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              required
            />
          </div>
        </div>

        {/* Image Section */}
        <div className="form-section">
          <h4><FaImage className="section-icon" /> Product Image</h4>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={data.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="form-section">
          <h4>Product Features</h4>
          <div className="features-container">
            <div className="feature-input-group">
              <input
                type="text"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                placeholder="Add a feature"
                className="feature-input"
              />
              <button
                type="button"
                onClick={handleFeatureAdd}
                className="feature-add-btn"
              >
                Add Feature
              </button>
            </div>
            <div className="features-list">
              {data.features.map((feat, index) => (
                <div key={index} className="feature-tag">
                  {feat}
                  <span
                    onClick={() => handleFeatureRemove(index)}
                    className="feature-remove"
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="form-section">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={data.status}
              onChange={handleChange}
              className="status-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Product
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/product")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
