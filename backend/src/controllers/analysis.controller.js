const Analysis = require("../models/analysis.model");
const n8nService = require("../services/n8n.service");
const logger = require("../utils/logger");

// Analyze advertisement
exports.analyzeAd = async (req, res, next) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Text or image is required" });
    }

    // Create analysis record
    const analysis = await Analysis.create({
      type: "ad_analysis",
      user: req.user?.id,
      imageUrl,
      inputText: text,
      status: "processing",
    });

    try {
      let extractedText = text || "";

      // If image provided, run OCR first
      if (imageUrl) {
        const ocrResult = await n8nService.triggerOCRWorkflow(imageUrl);
        extractedText = ocrResult.text;
        analysis.extractedText = extractedText;
        analysis.ocrConfidence = ocrResult.confidence;
      }

      // Run claim detection
      const claimResult = await n8nService.triggerClaimDetection(extractedText);
      analysis.detectedClaims = claimResult.claims.map((claim) => ({
        claim: claim.text,
        issue: claim.issue,
        severity: claim.severity,
        verified: claim.verified,
      }));

      // Calculate risk score
      const scoreResult = await n8nService.triggerSafetyScore({
        claims: claimResult.claims,
        text: extractedText,
      });

      analysis.riskScore = scoreResult.score;
      analysis.nutritionContradictions = scoreResult.contradictions || [];
      analysis.warnings = scoreResult.warnings || [];
      analysis.status = "completed";
      analysis.completedAt = new Date();

      await analysis.save();

      logger.info(`Ad analysis completed: ${analysis._id}`);

      res.json({
        analysisId: analysis._id,
        riskScore: analysis.riskScore,
        detectedClaims: analysis.detectedClaims,
        nutritionContradictions: analysis.nutritionContradictions,
        warnings: analysis.warnings,
        extractedText: analysis.extractedText,
      });
    } catch (err) {
      analysis.status = "failed";
      await analysis.save();
      logger.error(`Ad analysis failed: ${err.message}`);
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// Get user's analysis history
exports.getAnalysisHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const query = { user: req.user.id };
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [analyses, total] = await Promise.all([
      Analysis.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("product", "name brand imageUrl"),
      Analysis.countDocuments(query),
    ]);

    res.json({
      analyses,
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

// Get single analysis
exports.getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate("product");

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalScans, recentScans, avgScore, highRiskCount] =
      await Promise.all([
        Analysis.countDocuments({ user: userId }),
        Analysis.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("product", "name brand safetyScore"),
        Analysis.aggregate([
          { $match: { user: userId, riskScore: { $exists: true } } },
          { $group: { _id: null, avg: { $avg: "$riskScore" } } },
        ]),
        Analysis.countDocuments({ user: userId, riskScore: { $gte: 70 } }),
      ]);

    res.json({
      totalScans,
      recentScans,
      averageScore: avgScore[0]?.avg || 0,
      highRiskCount,
    });
  } catch (error) {
    next(error);
  }
};
