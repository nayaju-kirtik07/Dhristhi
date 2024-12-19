import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/config";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      setLoading(true);
      const response = await api.get("/cart");
      setCartItems(response.data.data.items || []);
    } catch (err) {
      setError("Failed to fetch cart items");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      setLoading(true);
      const response = await api.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      setCartItems(response.data.data.items);
      setSuccessMessage("Item added to cart successfully");
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
      setSuccessMessage("Item removed from cart");
    } catch (err) {
      setError("Failed to remove item from cart");
      console.error("Error removing from cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setLoading(true);
      await api.put("/cart/update", {
        productId,
        quantity: newQuantity,
      });
      await fetchCart();
      setSuccessMessage("Cart updated successfully");
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Error updating quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await api.delete("/cart/clear");
      setCartItems([]);
      setSuccessMessage("Cart cleared successfully");
    } catch (err) {
      setError("Failed to clear cart");
      console.error("Error clearing cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) {
      fetchCart();
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    getTotalItems,
    loading,
    error,
    successMessage,
    clearMessages
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
