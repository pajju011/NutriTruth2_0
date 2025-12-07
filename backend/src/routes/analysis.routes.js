const express = require("express");
const analysisController = require("../controllers/analysis.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const optionalAuth = require("../middlewares/optionalAuth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// POST /api/analysis/ad - Analyze advertisement
router.post(
  "/ad",
  optionalAuth,
  upload.single("image"),
  analysisController.analyzeAd
);

// GET /api/analysis/history - Get user's analysis history
router.get("/history", authMiddleware, analysisController.getAnalysisHistory);

// GET /api/analysis/dashboard - Get dashboard stats
router.get("/dashboard", authMiddleware, analysisController.getDashboardStats);

// GET /api/analysis/:id - Get single analysis
router.get("/:id", analysisController.getAnalysis);

module.exports = router;
