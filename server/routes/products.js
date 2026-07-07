const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// All routes are protected by auth middleware applied in server.js

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const { name, sku, price, stockQty } = req.body;
    const product = new Product({
      userId: req.userId,
      name,
      sku,
      price,
      stockQty,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, sku, price, stockQty } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, sku, price, stockQty },
      { new: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
