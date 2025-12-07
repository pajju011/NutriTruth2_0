const Product = require("../models/product.model");
const n8nService = require("../services/n8n.service");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.scanProduct = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    const ocrResult = await n8nService.triggerOCRWorkflow(imageUrl);
    const claimResult = await n8nService.triggerClaimDetection(ocrResult.text);
    res.json({ ocrResult, claimResult });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};
