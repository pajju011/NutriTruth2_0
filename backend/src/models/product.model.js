const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, unique: true, sparse: true },
  ingredients: [String],
  nutritionFacts: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    sugar: Number,
    sodium: Number,
  },
  claims: [String],
  safetyScore: { type: Number, min: 0, max: 100 },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
