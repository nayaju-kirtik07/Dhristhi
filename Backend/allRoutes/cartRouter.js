const cartController = require('../controller/carts');
const express = require("express");
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();
const api = process.env.API_URL;

// Protect all cart routes
router.use(protect);

// Cart routes
router.get(`${api}/cart`, cartController.getCart);
router.post(`${api}/cart/add`, cartController.addToCart);
router.put(`${api}/cart/update`, cartController.updateCartItem);
router.delete(`${api}/cart/remove/:productId`, cartController.removeFromCart);
router.delete(`${api}/cart/clear`, cartController.clearCart);

module.exports = router;
