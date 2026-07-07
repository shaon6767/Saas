const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// GET /api/customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/customers
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const customer = new Customer({ userId: req.userId, name, email, phone });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/customers/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, email, phone },
      { new: true },
    );
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/customers/:id
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
