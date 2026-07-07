const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        qty: Number,
        price: Number,
      },
    ],
    total: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
