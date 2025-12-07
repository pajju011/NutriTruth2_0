const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: { type: String, index: true },
  barcode: { type: String, unique: true, sparse: true },
  category: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  ingredients: [String],
  nutritionFacts: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    sugar: Number,
    sodium: Number,
    fiber: Number,
  },
  claims: [String],
  safetyScore: { type: Number, min: 0, max: 100, default: 50 },
  verified: { type: Boolean, default: false },
  warnings: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Text search index
productSchema.index({ name: "text", brand: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
