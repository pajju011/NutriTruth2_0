const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const optionalAuth = require("../middlewares/optionalAuth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// GET /api/products/search?q=milk
router.get("/search", productController.searchProducts);

// GET /api/products/:id
router.get("/:id", optionalAuth, productController.getProduct);

// POST /api/products/scan/barcode
router.post("/scan/barcode", optionalAuth, productController.scanByBarcode);

// POST /api/products/scan/image
router.post(
  "/scan/image",
  optionalAuth,
  upload.single("image"),
  productController.scanByImage
);

// GET /api/products/results/:id
router.get("/results/:id", productController.getAnalysisResults);

// POST /api/products/save
router.post("/save", authMiddleware, productController.saveProduct);

// DELETE /api/products/save/:productId
router.delete(
  "/save/:productId",
  authMiddleware,
  productController.unsaveProduct
);

module.exports = router;
