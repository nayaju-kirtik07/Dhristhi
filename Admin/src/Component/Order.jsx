import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";
import { ErrorToster, SuccessToster } from "./Toster";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successShow, setSuccessShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);

  const headers = [
    {
      title: "Order ID",
      field: "_id",
    },
    {
      title: "Customer",
      field: "userDetails",
      render: (data) => (
        <div>
          <div>{data.userDetails.fullName}</div>
          <div className="text-muted small">{data.userDetails.email}</div>
        </div>
      ),
    },
    {
      title: "Items",
      field: "items",
      render: (data) => (
        <div>
          {data.items.map((item, index) => (
            <div key={index}>
              {item.product.name} x {item.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total Amount",
      field: "totalAmount",
      render: (data) => `Rs. ${data.totalAmount.toFixed(2)}`,
    },
    {
      title: "Status",
      field: "status",
      render: (data) => (
        <FormControl size="small" fullWidth>
          <Select
            value={data.status}
            onChange={(e) => handleStatusChange(data._id, e.target.value)}
            className={`status-${data.status.toLowerCase()}`}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      title: "Order Date",
      field: "orderDate",
      render: (data) => new Date(data.orderDate).toLocaleDateString(),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage(error.response?.data?.message || "Error fetching orders");
      setErrorShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.put(
        `${process.env.REACT_APP_API_URL}/update-order`,
        {
          orderId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Order status updated successfully");
      setSuccessShow(true);
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error("Error updating order status:", error);
      setErrorMessage(error.response?.data?.message || "Error updating order status");
      setErrorShow(true);
    }
  };

  return (
    <div className="orders-wrapper">
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


      <div className="order-header">
        <h4 className="card-title">Orders</h4>
      </div>
      <div className="card-body">
        <Table
          headers={headers}
          data={orders}
          loading={loading}
          showActions={false}
        />
      </div>


    </div>
  );
};

export default Orders;