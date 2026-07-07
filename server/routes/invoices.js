const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

// GET /api/invoices
router.get("/", async (req, res) => {
  try {
    // Populate customer name so we don't need a second request on frontend
    const invoices = await Invoice.find({ userId: req.userId })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/invoices
router.post("/", async (req, res) => {
  try {
    const { customerId, items } = req.body; // items: [{ productId, qty }]

    // Verify customer belongs to user
    const customer = await Customer.findOne({
      _id: customerId,
      userId: req.userId,
    });
    if (!customer) return res.status(400).json({ message: "Invalid customer" });

    let total = 0;
    const finalItems = [];

    // Fetch current prices from DB to prevent client-side tampering
    for (let item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        userId: req.userId,
      });
      if (!product) continue;

      const itemTotal = product.price * item.qty;
      total += itemTotal;

      finalItems.push({
        productId: product._id,
        name: product.name,
        qty: item.qty,
        price: product.price,
      });
    }

    const invoice = new Invoice({
      userId: req.userId,
      customerId,
      items: finalItems,
      total,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/invoices/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    invoice.status = invoice.status === "unpaid" ? "paid" : "unpaid";
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
