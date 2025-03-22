const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

router.post("/create-products", productController.createProduct);

module.exports = router;
