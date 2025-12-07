const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/product.model");

const products = [
  {
    name: "Organic Honey",
    brand: "Nature's Best",
    barcode: "8901234567890",
    category: "Sweeteners",
    description: "Pure organic honey sourced from natural beekeepers.",
    ingredients: ["Organic Honey"],
    nutritionFacts: {
      calories: 64,
      protein: 0.1,
      carbs: 17,
      sugar: 17,
      fat: 0,
      sodium: 1,
    },
    claims: ["100% Organic", "No Added Sugar", "Natural"],
    safetyScore: 85,
    verified: true,
    warnings: [],
  },
  {
    name: "Whole Wheat Bread",
    brand: "Healthy Bake",
    barcode: "8901234567891",
    category: "Bakery",
    description: "Nutritious whole wheat bread for healthy living.",
    ingredients: ["Whole Wheat Flour", "Water", "Yeast", "Salt", "Sugar"],
    nutritionFacts: {
      calories: 247,
      protein: 13,
      carbs: 41,
      sugar: 5,
      fat: 3.4,
      sodium: 400,
    },
    claims: ["High Fiber", "No Preservatives"],
    safetyScore: 72,
    verified: true,
    warnings: ["Contains Gluten"],
  },
  {
    name: "Greek Yogurt",
    brand: "DairyPure",
    barcode: "8901234567892",
    category: "Dairy",
    description: "Creamy Greek yogurt with high protein content.",
    ingredients: ["Milk", "Live Cultures"],
    nutritionFacts: {
      calories: 100,
      protein: 17,
      carbs: 6,
      sugar: 4,
      fat: 0.7,
      sodium: 65,
    },
    claims: ["High Protein", "Probiotic", "Low Fat"],
    safetyScore: 90,
    verified: true,
    warnings: [],
  },
  {
    name: "Protein Bar",
    brand: "FitLife",
    barcode: "8901234567893",
    category: "Snacks",
    description: "High protein snack bar for fitness enthusiasts.",
    ingredients: [
      "Protein Blend",
      "Sugar",
      "Palm Oil",
      "Artificial Flavors",
      "Preservatives",
    ],
    nutritionFacts: {
      calories: 220,
      protein: 20,
      carbs: 25,
      sugar: 15,
      fat: 8,
      sodium: 180,
    },
    claims: ["High Protein", "Energy Boost", "Healthy Snack"],
    safetyScore: 45,
    verified: false,
    warnings: [
      "High Sugar Content",
      "Contains Artificial Ingredients",
      "Misleading 'Healthy' Claim",
    ],
  },
  {
    name: "Orange Juice",
    brand: "Fresh Squeeze",
    barcode: "8901234567894",
    category: "Beverages",
    description: "Fresh squeezed orange juice with no added sugar.",
    ingredients: ["Orange Juice", "Vitamin C"],
    nutritionFacts: {
      calories: 110,
      protein: 2,
      carbs: 26,
      sugar: 22,
      fat: 0,
      sodium: 0,
    },
    claims: ["100% Juice", "No Added Sugar", "Vitamin C Rich"],
    safetyScore: 68,
    verified: true,
    warnings: ["High Natural Sugar"],
  },
  {
    name: "Instant Noodles",
    brand: "QuickMeal",
    barcode: "8901234567895",
    category: "Ready to Eat",
    description: "Quick and easy instant noodles.",
    ingredients: [
      "Refined Wheat Flour",
      "Palm Oil",
      "Salt",
      "MSG",
      "Artificial Colors",
      "Preservatives",
    ],
    nutritionFacts: {
      calories: 380,
      protein: 8,
      carbs: 52,
      sugar: 2,
      fat: 14,
      sodium: 1500,
    },
    claims: ["Tasty", "Quick Meal"],
    safetyScore: 25,
    verified: false,
    warnings: [
      "Very High Sodium",
      "Contains MSG",
      "Highly Processed",
      "Low Nutritional Value",
    ],
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    await mongoose.disconnect();
    console.log("Done!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedProducts();
