const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", authMiddleware, productController.createProduct);
router.post("/scan", authMiddleware, productController.scanProduct);

module.exports = router;
