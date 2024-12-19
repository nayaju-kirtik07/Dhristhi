const express = require("express");
const router = express.Router();
const ProductController = require("../controller/products");
const { protect, admin } = require("../middleware/authMiddleWare");

const api = process.env.API_URL;

// Admin routes (protected)
router.post(`${api}/create-product`, protect, admin, ProductController.createProduct);
router.put(`${api}/update-product/:id`, protect, admin, ProductController.updateProduct);
router.delete(`${api}/delete-product/:id`, protect, admin, ProductController.deleteProduct);

// Public routes
router.get(`${api}/products`, ProductController.getAllProducts);
router.get(`${api}/get-single-product/:id`, ProductController.getProductById);

module.exports = router;
