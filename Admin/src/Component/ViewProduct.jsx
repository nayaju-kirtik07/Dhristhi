import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Table from "./Table";

const ViewProduct = () => {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");

  const header = [
    {
      title: "Product",
      field: "title",
      render: (data) => (
        <div>
          <span>
            <img
              className="mapped-image"
              data-bs-toggle="modal"
              data-bs-target="#imagemodal"
              src={data?.cover_image}
              alt={data?.title}
            />
          </span>
          {data?.title}
        </div>
      ),
    },
    {
      title: "Price",
      field: "price",
      render: (data) => `$ ${data?.price}`,
    },
    {
      title: "Discount Price",
      field: "discount_price",
      render: (data) => `$ ${data?.discount_price}`,
    },
    {
      title: "Stock Qty",
      field: "stock_amount",
    },
  ];

  useEffect(() => {
    if (slug) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/category/${slug}`,
      })
        .then((res) => {
          setCategory(res?.data?.title);
          setData(res?.data?.products);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [slug]);

  return (
    <div className="container product-table mt-5">
      <div className="product-button mb-3">
        <p className="page-heading">{category} Category</p>
      </div>
      <Table data={data} headers={header} />
    </div>
  );
};

export default ViewProduct;
