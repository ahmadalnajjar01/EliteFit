const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route to create a new order
router.post("/create-order", orderController.createOrder);

module.exports = router;
