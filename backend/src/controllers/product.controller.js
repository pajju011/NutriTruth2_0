const Product = require("../models/product.model");
const Analysis = require("../models/analysis.model");
const User = require("../models/user.model");
const n8nService = require("../services/n8n.service");
const logger = require("../utils/logger");

// Search products
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, category, minScore, maxScore, page = 1, limit = 20 } = req.query;

    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minScore || maxScore) {
      query.safetyScore = {};
      if (minScore) query.safetyScore.$gte = parseInt(minScore);
      if (maxScore) query.safetyScore.$lte = parseInt(maxScore);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ safetyScore: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add to user's scan history if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          scanHistory: {
            $each: [{ product: product._id }],
            $position: 0,
            $slice: 50, // Keep only last 50 scans
          },
        },
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Scan product by barcode
exports.scanByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({ message: "Barcode is required" });
    }

    // Check if product exists
    let product = await Product.findOne({ barcode });

    if (product) {
      return res.json({ product, source: "database" });
    }

    // Create analysis record
    const analysis = await Analysis.create({
      type: "product_scan",
      user: req.user?.id,
      barcode,
      status: "processing",
    });

    // Trigger n8n workflow for new product
    try {
      const result = await n8nService.triggerProductScan({ barcode });

      // Create new product from result
      product = await Product.create({
        barcode,
        name: result.name || "Unknown Product",
        brand: result.brand,
        ...result,
      });

      analysis.product = product._id;
      analysis.status = "completed";
      analysis.completedAt = new Date();
      await analysis.save();

      res.json({ product, source: "scanned", analysisId: analysis._id });
    } catch (err) {
      analysis.status = "failed";
      await analysis.save();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// Scan product by image
exports.scanByImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Create analysis record
    const analysis = await Analysis.create({
      type: "product_scan",
      user: req.user?.id,
      imageUrl,
      status: "processing",
    });

    // Trigger n8n OCR workflow
    try {
      const ocrResult = await n8nService.triggerOCRWorkflow(imageUrl);

      analysis.extractedText = ocrResult.text;
      analysis.ocrConfidence = ocrResult.confidence;

      // Trigger claim detection
      const claimResult = await n8nService.triggerClaimDetection(
        ocrResult.text
      );

      analysis.detectedClaims = claimResult.claims;
      analysis.status = "completed";
      analysis.completedAt = new Date();
      await analysis.save();

      res.json({
        analysisId: analysis._id,
        extractedText: ocrResult.text,
        claims: claimResult.claims,
      });
    } catch (err) {
      analysis.status = "failed";
      await analysis.save();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// Get analysis results
exports.getAnalysisResults = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id)
      .populate("product")
      .populate("user", "name email");

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

// Save product to user's list
exports.saveProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { savedProducts: productId },
    });

    res.json({ message: "Product saved" });
  } catch (error) {
    next(error);
  }
};

// Remove saved product
exports.unsaveProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { savedProducts: productId },
    });

    res.json({ message: "Product removed from saved" });
  } catch (error) {
    next(error);
  }
};
