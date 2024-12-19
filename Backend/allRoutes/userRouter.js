const UserController = require("../controller/users");
const express = require("express");
const { protect, admin } = require("../middleware/authMiddleWare");
const router = express.Router();
const api = process.env.API_URL;

// Public routes (no authentication needed)
router.post(`${api}/signup`, UserController.singUp);
router.post(`${api}/login`, UserController.login);
router.post(`${api}/admin/signup`, UserController.adminSignUp);
router.post(`${api}/admin/login`, UserController.adminLogin);

// Protected routes (require authentication)
router.get(`${api}/profile`, protect, UserController.getProfile);
router.put(`${api}/profile`, protect, UserController.updateProfile);

// Admin routes (require authentication and admin privileges)
router.get(`${api}/users`, protect, admin, UserController.getAllUsers);
router.delete(`${api}/users/:id`, protect, admin, UserController.deleteUser);

module.exports = router;
