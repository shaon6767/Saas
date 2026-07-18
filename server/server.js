const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const auth = require("./middleware/auth");

dotenv.config();
connectDB();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Public Routes
app.use("/api/auth", require("./routes/auth"));

// Protected Routes (Middleware applied)
app.use("/api/products", auth, require("./routes/products"));
app.use("/api/customers", auth, require("./routes/customers"));
app.use("/api/invoices", auth, require("./routes/invoices"));
app.use("/api/dashboard", auth, require("./routes/dashboard"));
// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
