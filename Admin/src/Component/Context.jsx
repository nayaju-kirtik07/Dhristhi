import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const Context = createContext();

export const AllContext = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Context.Provider value={{ products, categories, loading, fetchData }}>
      {children}
    </Context.Provider>
  );
};
