import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ErrorToster, SuccessToster } from "./Toster";
import Validation from "./Validation";

const AddCategory = () => {
  const navigate = useNavigate();
  const initialData = {
    name: "",
    description: "",
  };

  const [data, setData] = useState(initialData);
  const [localData, setLocalData] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    setLocalData(token);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/add-category`, data, {
        headers: {
          Authorization: `Bearer ${localData}`,
        },
      });
      setData(initialData);
      setSuccessMessage("Category Added Successfully!");
      setShow(true);
      setTimeout(() => navigate("/category"), 2000);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error adding category");
      setShow(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div>
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

      <div className="container add-form my-5 p-3">
        <h1 className="addProductHeading">Add Category</h1>
        <form className="mt-4" onSubmit={handleAdd}>
          <div className="row">
            <div className="col-12 my-3">
              <label htmlFor="name" className="form-label">
                Category Name <Validation />
              </label>
              <input
                type="text"
                className="form-control input-field"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter Category Name"
                required
              />
            </div>

            <div className="col-12 my-3">
              <label htmlFor="description" className="form-label">
                Description <Validation />
              </label>
              <textarea
                className="form-control input-field"
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                placeholder="Enter Category Description"
                rows="4"
                required
              />
            </div>
          </div>

          <div className="add-button">
            <button type="submit" className="product-btn">
              <i className="fa-solid fa-plus"></i>
              <span>Add Category</span>
            </button>

            <button
              type="button"
              className="btn btn-light ms-3"
              onClick={() => navigate("/category")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
