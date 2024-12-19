import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ProductEditModal from "./ProductEditModal";
import { ErrorToster, SuccessToster } from "./Toster";

const ProductDetails = () => {
  const { slug } = useParams();
  const [data, setData] = useState({});
  const [image, setImage] = useState({});
  const [dataToEdit, setDataToEdit] = useState({});
  const [imageToEdit, setImageToEdit] = useState([]);
  const [response, setResponse] = useState([]);
  const [localData, setLocalData] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reload, setReload] = useState(false);
  const [keys, setKeys] = useState("cover");
  const [show , setShow] = useState(false);

  useEffect(() => {
    if (slug) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/product/${slug}`,
      })
        .then((res) => {
          setData(res?.data?.productt);
          setImage(res?.data?.productt?.cover_image);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [slug , reload]);

  const handleImage = (e, element, index) => {
    e.preventDefault();
    setKeys(index);
    setImage(element);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setImageToEdit(JSON.parse(data?.images));
    setDataToEdit({ ...data, images: [] });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDataToEdit({ ...dataToEdit, [name]: value });
  };

  useEffect(() => {
    const localToken = JSON.parse(localStorage.getItem("token"));
    setLocalData(localToken);
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/category/getallcategory`,
    })
      .then((res) => {
        setResponse(res?.data?.allCategory);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const imageAdd = (e) => {
    e.preventDefault();
    setImageToEdit([...imageToEdit, dataToEdit.images]);
    setDataToEdit({ ...dataToEdit, images: [] });
  };

  const handleImageDelete = (e, index) => {
    e.preventDefault();
    setImageToEdit(imageToEdit.filter((element, keys) => keys !== index));
  };

  const closeModal = () => {
    const closeButton = document.getElementById("closeModal");
    closeButton.click();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_URL}/product/${slug}`,
      headers: {
        authorization: `Bearer ${localData}`,
      },
      data: {
        title: dataToEdit?.title,
        cover_image: dataToEdit?.cover_image,
        price: dataToEdit?.price,
        category_id: dataToEdit?.category_id,
        images: imageToEdit,
        discount_price: dataToEdit?.discount_price,
        description: dataToEdit?.description,
        stock_amount: dataToEdit?.stock,
      },
    })
      .then((res) => {
        setMessage(res?.data?.message);
        closeModal();
        setReload(!reload);
        setShow(true);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message);
        setShow(true);
      });
  };

  return (
    <div>
      <SuccessToster message={message} position={"top-right"} show={show} setShow={setShow} />
      <ErrorToster message={errorMessage} position={"top-right"} show = {show} setShow={setShow} />
      <div className="container single-items">
        <div className="row">
          {data?.images ? (
            <div className="col-1">
              <img
                className={`single-images mb-2 ${
                  keys === "cover" ? "activeImage" : ""
                }`}
                src={data.cover_image}
                alt={data?.title}
                height="100x"
                width="100px"
                onClick={(e) => {
                  handleImage(e, data?.cover_image);
                }}
              />
              {data?.images &&
                JSON.parse(data?.images).map((element, index) => {
                  return (
                    <>
                      <img
                        className={`single-images mb-2 ${
                          index === keys ? "activeImage" : ""
                        }`}
                        src={element}
                        alt=""
                        height="100px"
                        width="100px"
                        onClick={(e) => {
                          handleImage(e, element, index);
                        }}
                      />
                    </>
                  );
                })}
            </div>
          ) : null}
          <div className="col-5">
            <img
              className="single-image mx-4"
              src={image}
              alt=""
              height="400px"
              width="450px"
            />
          </div>

          <div className="col-6">
            <div className="row mb-5">
              <div className="col-6">
                <h3 className="detail-title">{data?.title}</h3>
                <button
                  className="detail-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={(e) => {
                    handleEdit(e);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square edit-icon"></i>{" "}
                  <span>Edit Product </span>
                </button>
              </div>

              <div className="col-6">
                <p>
                  <span
                    className={`detail-price pt-3 ${
                      data.discount_price ? "underline" : ""
                    }`}
                  >
                    {" "}
                    ${data?.price}{" "}
                  </span>
                  <span
                    className={`detail-discount ps-3 ${
                      data.discount_price === 0 ? "dont-show" : ""
                    }`}
                  >
                    ${data?.discount_price}
                  </span>{" "}
                </p>
                <p className="detail-stock">
                  Stock Available : {data?.stock_amount}
                </p>
              </div>
            </div>

            <div className="detail-description mt5">
              <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button
                      className="accordion-button collapsed detail-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      Detail
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">{data?.description}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductEditModal
        handleChange={(e) => handleChange(e)}
        dataToEdit={dataToEdit}
        response={response}
        imageToEdit={imageToEdit}
        handleUpdate={(e) => handleUpdate(e)}
        handleImageDelete={(e) => {
          handleImageDelete(e);
        }}
        imageAdd={(e) => {
          imageAdd(e);
        }}
      />
    </div>
  );
};

export default ProductDetails;
