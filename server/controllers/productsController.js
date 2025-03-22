const { Product } = require("../models");
const upload = require("../config/multerConfig");

const createProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const {
        name,
        description,
        price,
        categoryId,
        occasionId,
        stock,
        status,
        isNewArrival,
        onSale,
      } = req.body;

      const image = req.file ? req.file.path : null;

      const product = await Product.create({
        name,
        description,
        price,
        categoryId,
        occasionId,
        image,
        stock,
        status,
        isNewArrival,
        onSale,
      });

      res
        .status(201)
        .json({ message: "Product created successfully", product });
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

module.exports = {
  createProduct,
};
