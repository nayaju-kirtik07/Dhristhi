const orderController = require('../controller/orders');
const express = require("express");
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();
const api = process.env.API_URL;// In your orderRouter.js

// Protect all cart routes
router.use(protect);

// Cart routes
router.get(`${api}/get-orders`, orderController.getOrders);
router.post(`${api}/add-order`, orderController.createOrder);
// router.put(`${api}/update-order`, orderController.);

module.exports = router;
