const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    // 1. Total Revenue (sum of totals where status is 'paid')
    const paidInvoices = await Invoice.find({
      userId: req.userId,
      status: "paid",
    });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // 2. Total Unpaid Amount
    const unpaidInvoices = await Invoice.find({
      userId: req.userId,
      status: "unpaid",
    });
    const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // 3. Product Count
    const productCount = await Product.countDocuments({ userId: req.userId });

    // 4. Low Stock Product Count (stockQty < 5)
    const lowStockCount = await Product.countDocuments({
      userId: req.userId,
      stockQty: { $lt: 5 },
    });

    res.json({
      totalRevenue,
      totalUnpaid,
      productCount,
      lowStockCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
