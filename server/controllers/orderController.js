const jwt = require("jsonwebtoken");
const { Order } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Get token from header ("Authorization: Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    // Use the correct property from your token payload:
    const userId = decoded.userId;

    // Get order details from request body
    const { productIds, total, size, color } = req.body;

    // Ensure productIds is an array and total is provided
    if (
      !productIds ||
      !Array.isArray(productIds) ||
      productIds.length === 0 ||
      !total
    ) {
      return res.status(400).json({
        message: "Missing required fields: productIds (array) and total",
      });
    }

    // Create order with provided details
    const newOrder = await Order.create({
      userId,
      productIds,
      total,
      status: "pending", // default status, can be modified
      size,
      color,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};
