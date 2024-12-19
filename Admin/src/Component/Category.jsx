import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import { ErrorToster, SuccessToster } from "./Toster";
import DeleteModal from './DeleteModal';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const headers = [
    {
      title: "Category Name",
      field: "name",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Products",
      field: "products",
      render: (data) => data.products?.length || 0,
    },
  ];

  const actions = [
    {
      icon: <i className="fa-solid fa-pen-to-square edit-icon" />,
      title: "Edit",
      action: (e, id) => handleEdit(e, id),
      color: "#007bff",
    },
    {
      icon: <i className="fa-solid fa-trash delete-icon" />,
      title: "Delete",
      action: (e, id) => handleDelete(e, id),
      color: "#dc3545",
    },
    {
      icon: <i className="fa-solid fa-eye view-icon" />,
      title: "View",
      action: (e, id) => handleView(e, id),
      color: "#28a745",
    },
  ];

  useEffect(() => {
    if (token) {
      fetchCategories();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
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
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    navigate(`/category/edit/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    setSelectedCategory(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-category/${selectedCategory}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setShow(true);
      fetchCategories();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error deleting category");
      setShow(true);
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleView = (e, id) => {
    e.preventDefault();
    navigate(`/category/${id}`);
  };

  const handleAdd = () => {
    navigate("/addcategory");
  };

  if (!token) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mt-4">
      <SuccessToster
        message={successMessage}
        position={"top-right"}
        show={show}
        setShow={setShow}
      />
      <ErrorToster
        message={errorMessage}
        position={"top-right"}
        show={show}
        setShow={setShow}
      />

      <div className="category-container d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-heading">Categories</h2>
        <button className="product-btn" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i> Add Category
        </button>
      </div>

      <DeleteModal 
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName="category"
      />

      <Table
        headers={headers}
        data={categories}
        action={actions}
        loader={loading}
      />
    </div>
  );
};

export default Category;
