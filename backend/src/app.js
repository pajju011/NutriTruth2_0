const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const analysisRoutes = require("./routes/analysis.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/analysis", analysisRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API info
app.get("/api", (req, res) => {
  res.json({
    name: "NutriTruth API",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      analysis: "/api/analysis",
    },
  });
});

// Error handling
app.use(errorMiddleware);

module.exports = app;
