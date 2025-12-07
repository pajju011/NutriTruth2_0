import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ui/action-button";
import { Search, Star, AlertTriangle, ChevronRight } from "lucide-react";

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Organic Honey",
    brand: "Nature's Best",
    score: 85,
    category: "Sweeteners",
    image: "🍯",
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    brand: "Healthy Bake",
    score: 72,
    category: "Bakery",
    image: "🍞",
  },
  {
    id: 3,
    name: "Greek Yogurt",
    brand: "DairyPure",
    score: 90,
    category: "Dairy",
    image: "🥛",
  },
  {
    id: 4,
    name: "Protein Bar",
    brand: "FitLife",
    score: 45,
    category: "Snacks",
    image: "🍫",
  },
  {
    id: 5,
    name: "Orange Juice",
    brand: "Fresh Squeeze",
    score: 68,
    category: "Beverages",
    image: "🧃",
  },
  {
    id: 6,
    name: "Instant Noodles",
    brand: "QuickMeal",
    score: 25,
    category: "Ready to Eat",
    image: "🍜",
  },
];

function getScoreColor(score) {
  if (score >= 70) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
}

function getScoreBg(score) {
  if (score >= 70) return "bg-green-500/20";
  if (score >= 50) return "bg-yellow-500/20";
  return "bg-red-500/20";
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-lg max-w-2xl mx-auto">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <ActionButton variant="primary" className="px-4 py-2 text-sm">
              Search
            </ActionButton>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} products found {query && `for "${query}"`}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{product.image}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.brand}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.category}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full ${getScoreBg(
                          product.score
                        )}`}
                      >
                        {product.score >= 70 ? (
                          <Star
                            className={`h-4 w-4 ${getScoreColor(
                              product.score
                            )}`}
                          />
                        ) : (
                          <AlertTriangle
                            className={`h-4 w-4 ${getScoreColor(
                              product.score
                            )}`}
                          />
                        )}
                        <span
                          className={`text-sm font-bold ${getScoreColor(
                            product.score
                          )}`}
                        >
                          {product.score}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-muted-foreground text-sm mt-2">
              Try a different search term
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
