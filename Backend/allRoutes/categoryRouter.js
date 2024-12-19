// Import required modules
const categoryController = require('../controller/categorys');
const express = require('express');
const { protect, admin } = require('../middleware/authMiddleWare');

const router = express.Router();
const api = process.env.API_URL;

// Define routes
router.get(`${api}/categories`, categoryController.getAllCategories);
router.get(`${api}/category-with-product/:id`, categoryController.getCategoryWithProducts);
router.put(`${api}/edit-category/:id`, protect, admin, categoryController.editCategory);
router.delete(`${api}/delete-category/:id`, protect, admin, categoryController.removeCategory);

// Add category route (protected, admin only)
router.post(`${api}/add-category`, protect, admin, categoryController.createCategory);

// Export the router
module.exports = router;
