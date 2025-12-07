import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ui/action-button";
import {
  ArrowLeft,
  Star,
  AlertTriangle,
  Shield,
  FileSearch,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock product details
const mockProductDetails = {
  1: {
    id: 1,
    name: "Organic Honey",
    brand: "Nature's Best",
    score: 85,
    image: "🍯",
    description: "Pure organic honey sourced from natural beekeepers.",
    nutrition: {
      calories: 64,
      protein: 0.1,
      carbs: 17,
      sugar: 17,
      fat: 0,
      sodium: 1,
    },
    ingredients: ["Organic Honey"],
    claims: ["100% Organic", "No Added Sugar", "Natural"],
    warnings: [],
    verified: true,
  },
  2: {
    id: 2,
    name: "Whole Wheat Bread",
    brand: "Healthy Bake",
    score: 72,
    image: "🍞",
    description: "Nutritious whole wheat bread for healthy living.",
    nutrition: {
      calories: 247,
      protein: 13,
      carbs: 41,
      sugar: 5,
      fat: 3.4,
      sodium: 400,
    },
    ingredients: ["Whole Wheat Flour", "Water", "Yeast", "Salt", "Sugar"],
    claims: ["High Fiber", "No Preservatives"],
    warnings: ["Contains Gluten"],
    verified: true,
  },
  4: {
    id: 4,
    name: "Protein Bar",
    brand: "FitLife",
    score: 45,
    image: "🍫",
    description: "High protein snack bar for fitness enthusiasts.",
    nutrition: {
      calories: 220,
      protein: 20,
      carbs: 25,
      sugar: 15,
      fat: 8,
      sodium: 180,
    },
    ingredients: [
      "Protein Blend",
      "Sugar",
      "Palm Oil",
      "Artificial Flavors",
      "Preservatives",
    ],
    claims: ["High Protein", "Energy Boost", "Healthy Snack"],
    warnings: [
      "High Sugar Content",
      "Contains Artificial Ingredients",
      "Misleading 'Healthy' Claim",
    ],
    verified: false,
  },
  6: {
    id: 6,
    name: "Instant Noodles",
    brand: "QuickMeal",
    score: 25,
    image: "🍜",
    description: "Quick and easy instant noodles.",
    nutrition: {
      calories: 380,
      protein: 8,
      carbs: 52,
      sugar: 2,
      fat: 14,
      sodium: 1500,
    },
    ingredients: [
      "Refined Wheat Flour",
      "Palm Oil",
      "Salt",
      "MSG",
      "Artificial Colors",
      "Preservatives",
    ],
    claims: ["Tasty", "Quick Meal"],
    warnings: [
      "Very High Sodium",
      "Contains MSG",
      "Highly Processed",
      "Low Nutritional Value",
    ],
    verified: false,
  },
};

// Default product for IDs not in mock data
const defaultProduct = {
  id: 0,
  name: "Product",
  brand: "Brand",
  score: 70,
  image: "📦",
  description: "Product description.",
  nutrition: {
    calories: 100,
    protein: 5,
    carbs: 20,
    sugar: 5,
    fat: 3,
    sodium: 100,
  },
  ingredients: ["Ingredient 1", "Ingredient 2"],
  claims: ["Claim 1"],
  warnings: [],
  verified: true,
};

function getScoreColor(score) {
  if (score >= 70) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
}

function getScoreBg(score) {
  if (score >= 70) return "bg-green-500/20 border-green-500/30";
  if (score >= 50) return "bg-yellow-500/20 border-yellow-500/30";
  return "bg-red-500/20 border-red-500/30";
}

function getScoreLabel(score) {
  if (score >= 70) return "Good Choice";
  if (score >= 50) return "Moderate";
  return "Poor Choice";
}

export function ProductPage() {
  const { id } = useParams();
  const product = mockProductDetails[id] || { ...defaultProduct, id };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6">
        {/* Back Button */}
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="text-6xl">{product.image}</div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-card-foreground">
                      {product.name}
                    </h1>
                    <p className="text-muted-foreground">{product.brand}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      {product.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          <Shield className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                          <AlertTriangle className="h-3 w-3" /> Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Facts */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Nutrition Facts
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(product.nutrition).map(([key, value]) => (
                    <div
                      key={key}
                      className="text-center p-3 rounded-lg bg-muted/50"
                    >
                      <p className="text-2xl font-bold text-card-foreground">
                        {value}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {key === "sodium"
                          ? "mg"
                          : key === "calories"
                          ? "kcal"
                          : "g"}{" "}
                        {key}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Ingredients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Claims */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Product Claims
                </h2>
                <div className="space-y-2">
                  {product.claims.map((claim, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-card-foreground">{claim}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust Score */}
            <Card className={`border ${getScoreBg(product.score)}`}>
              <CardContent className="p-6 text-center">
                <h2 className="text-lg font-semibold text-card-foreground mb-2">
                  Trust Score
                </h2>
                <div
                  className={`text-5xl font-bold ${getScoreColor(
                    product.score
                  )}`}
                >
                  {product.score}
                </div>
                <p className={`text-sm mt-1 ${getScoreColor(product.score)}`}>
                  {getScoreLabel(product.score)}
                </p>
                <div className="flex justify-center mt-3">
                  {product.score >= 70 ? (
                    <Star
                      className={`h-6 w-6 ${getScoreColor(product.score)}`}
                    />
                  ) : (
                    <AlertTriangle
                      className={`h-6 w-6 ${getScoreColor(product.score)}`}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            {product.warnings.length > 0 && (
              <Card className="border border-red-500/30 bg-red-500/10">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-red-500 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Warnings
                  </h2>
                  <div className="space-y-2">
                    {product.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-red-400">{warning}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analyze Ad Button */}
            <Link to={`/analyze?product=${product.id}`}>
              <ActionButton
                variant="outline"
                icon={<FileSearch className="h-5 w-5" />}
                className="w-full"
              >
                Analyze Advertisement
              </ActionButton>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
