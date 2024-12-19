import React, { useState } from "react";
import Validation from "./Validation";
import axios from "axios";

export const ProductEditModal = ({
  productId,
  categories,
  setSuccessShow,
  setErrorShow,
  setMessage,
  setErrorMessage,
  fetchProducts
}) => {
  const [dataToEdit, setDataToEdit] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataToEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageDelete = () => {
    setDataToEdit(prev => ({
      ...prev,
      imageUrl: ""
    }));
  };

  const imageAdd = () => {
    // Handle image addition if needed
  };

  // Fetch product data when modal opens
  const fetchProductData = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-single-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setDataToEdit(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
      setErrorMessage(error.response?.data?.message || "Error fetching product");
      setErrorShow(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: dataToEdit.name,
        description: dataToEdit.description,
        price: Number(dataToEdit.price),
        discount_price: Number(dataToEdit.discount_price) || 0,
        category: dataToEdit.category,
        stock: Number(dataToEdit.stock),
        imageUrl: dataToEdit.imageUrl
      };

      console.log("Data being sent:", updateData);

      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update-product/${dataToEdit._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage("Product updated successfully");
        setSuccessShow(true);
        fetchProducts();

        // Close the modal
        const modalElement = document.getElementById('editModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      } else {
        throw new Error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage(error.response?.data?.message || "Error updating product");
      setErrorShow(true);
    }
  };

  // Add event listener for modal show
  React.useEffect(() => {
    const modalElement = document.getElementById('editModal');
    modalElement.addEventListener('show.bs.modal', () => {
      if (productId) {
        fetchProductData(productId);
      }
    });
  }, [productId]);

  return (
    <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title">
              <i className="fas fa-edit"></i> Edit Product
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeModal"
            ></button>
          </div>

          <div className="modal-body">
            <form className="edit-product-form">
              {/* Product Details Section */}
              <div className="form-section">
                <h4><i className="fas fa-box"></i> Product Details</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">
                        Product Name <Validation />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={dataToEdit.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="category">
                        Category <Validation />
                      </label>
                      <select
                        className="form-control"
                        id="category"
                        name="category"
                        value={dataToEdit.category}
                        onChange={handleChange}
                      >
                        <option value="">Select Category</option>
                        {categories?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="form-section">
                <h4><i className="fas fa-tag"></i> Pricing Details</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="price">
                        Price (NRs) <Validation />
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={dataToEdit.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="discount_price">
                        Discount Price (NRs)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="discount_price"
                        name="discount_price"
                        value={dataToEdit.discount_price}
                        onChange={handleChange}
                        placeholder="Enter discount price"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Section */}
              <div className="form-section">
                <h4><i className="fas fa-warehouse"></i> Stock Information</h4>
                <div className="form-group">
                  <label htmlFor="stock">
                    Stock Quantity <Validation />
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={dataToEdit.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="form-section">
                <h4><i className="fas fa-images"></i> Product Images</h4>
                <div className="form-group">
                  <label htmlFor="imageUrl">
                    Image URL <Validation />
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={dataToEdit.imageUrl}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-primary"
                      onClick={imageAdd}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="image-preview-container">
                  {dataToEdit.imageUrl && (
                    <div className="image-preview">
                      <img
                        src={dataToEdit.imageUrl}
                        alt="Product"
                        className="preview-image"
                      />
                      <button
                        type="button"
                        className="delete-image-btn"
                        onClick={handleImageDelete}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="form-section">
                <h4><i className="fas fa-align-left"></i> Description</h4>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={dataToEdit.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter product description"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdate}
            >
              <i className="fas fa-save"></i> Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;
