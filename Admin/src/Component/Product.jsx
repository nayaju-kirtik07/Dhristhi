import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "./Table";
import { ErrorToster, SuccessToster } from "./Toster";
import DeleteModal from "./DeleteModal";
import { ProductEditModal } from "./ProductEditModal";

export const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successShow, setSuccessShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const headers = [
    {
      title: "Product",
      field: "name",
      render: (data) => (
        <div className="product-info">
          <img src={data.imageUrl} alt={data.name} className="product-img" />
          <span>{data.name}</span>
        </div>
      ),
    },
    {
      title: "Category",
      field: "category",
      render: (data) => {
        const category = categories.find(cat => cat._id === data.category);
        return category ? category.name : "No Category";
      },
    },
    {
      title: "Price (NRs)",
      field: "price",
    },
    {
      title: "Discount (Nrs)",
      field: "discount_price",
      render: (data) => data.discount_price || "-",
    },
    {
      title: "Stock",
      field: "stock",
    },
  ];

  const actions = [
    {
      icon: <i className="fa-solid fa-eye view-icon"></i>,
      title: "View",
      action: (e, id) => handleView(e, id),
      color: "#28a745",
    },
    {
      icon: <i className="fa-solid fa-pen-to-square edit-icon"></i>,
      title: "Edit",
      action: (e, id) => handleEdit(e, id),
      color: "#007bff",
    },
    {
      icon: <i className="fa-solid fa-trash delete-icon"></i>,
      title: "Delete",
      action: (e, id) => handleDelete(e, id),
      color: "#dc3545",
    },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrorMessage(error.response?.data?.message || "Error fetching categories");
      setErrorShow(true);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Products response:", response.data);
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage(error.response?.data?.message || "Error fetching products");
      setErrorShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    setSelectedProduct(id);
    const editModal = new window.bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    console.log("Product ID to delete:", id);
    setSelectedProduct(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) {
      setErrorMessage("No product selected for deletion");
      setErrorShow(true);
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-product/${selectedProduct}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage("Product deleted successfully");
      setSuccessShow(true);
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage(error.response?.data?.message || "Error deleting product");
      setErrorShow(true);
    } finally {
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="products-wrapper">
      <SuccessToster 
        message={message} 
        show={successShow} 
        setShow={setSuccessShow}
        position="top-right"
      />
      <ErrorToster 
        message={errorMessage} 
        show={errorShow} 
        setShow={setErrorShow} 
        position="top-right"
      />

      <DeleteModal 
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName="product"
      />

      <ProductEditModal 
        productId={selectedProduct}
        categories={categories}
        setSuccessShow={setSuccessShow}
        setErrorShow={setErrorShow}
        setMessage={setMessage}
        setErrorMessage={setErrorMessage}
        fetchProducts={fetchProducts}
      />

      <div className="products-header">
        <h2>Products Management</h2>
        <button 
          className="add-product-button"
          onClick={() => navigate('/addproduct')}
        >
          <i className="fa-solid fa-plus"></i> Add Product
        </button>
      </div>

      <div className="products-table">
        <Table 
          headers={headers}
          data={products}
          action={actions}
          loader={loading}
        />
      </div>
    </div>
  );
};

export default Products;
