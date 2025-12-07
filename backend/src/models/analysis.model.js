const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  type: { type: String, enum: ["product_scan", "ad_analysis"], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

  // Input data
  imageUrl: { type: String },
  inputText: { type: String },
  barcode: { type: String },

  // OCR Results
  extractedText: { type: String },
  ocrConfidence: { type: Number },

  // Claim Detection Results
  detectedClaims: [
    {
      claim: String,
      issue: String,
      severity: { type: String, enum: ["low", "medium", "high"] },
      verified: Boolean,
    },
  ],

  // Safety Score Results
  riskScore: { type: Number, min: 0, max: 100 },
  nutritionContradictions: [String],
  warnings: [String],

  // Status
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model("Analysis", analysisSchema);
