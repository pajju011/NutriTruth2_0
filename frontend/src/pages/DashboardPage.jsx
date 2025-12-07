import { Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ui/action-button";
import {
  ScanLine,
  FileSearch,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  AlertTriangle,
  ChevronRight,
  Bookmark,
} from "lucide-react";

// Mock user data
const recentScans = [
  {
    id: 1,
    name: "Organic Honey",
    brand: "Nature's Best",
    score: 85,
    date: "2 hours ago",
    image: "🍯",
  },
  {
    id: 4,
    name: "Protein Bar",
    brand: "FitLife",
    score: 45,
    date: "Yesterday",
    image: "🍫",
  },
  {
    id: 6,
    name: "Instant Noodles",
    brand: "QuickMeal",
    score: 25,
    date: "2 days ago",
    image: "🍜",
  },
];

const savedItems = [
  { id: 3, name: "Greek Yogurt", brand: "DairyPure", score: 90, image: "🥛" },
  {
    id: 2,
    name: "Whole Wheat Bread",
    brand: "Healthy Bake",
    score: 72,
    image: "🍞",
  },
];

const riskTrends = {
  averageScore: 62,
  trend: "up",
  change: 8,
  totalScans: 24,
  highRiskItems: 5,
};

function getScoreColor(score) {
  if (score >= 70) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
}

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your food safety journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Link to="/search">
            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ScanLine className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Scan Product
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check a new product
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/analyze">
            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <FileSearch className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Analyze Ad
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check advertisement claims
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-card-foreground">
                {riskTrends.totalScans}
              </p>
              <p className="text-sm text-muted-foreground">Total Scans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-bold text-card-foreground">
                  {riskTrends.averageScore}
                </p>
                {riskTrends.trend === "up" ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-red-500">
                {riskTrends.highRiskItems}
              </p>
              <p className="text-sm text-muted-foreground">High Risk Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-green-500">
                +{riskTrends.change}%
              </p>
              <p className="text-sm text-muted-foreground">Score Improvement</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Scans */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Scans
                </h2>
                <Link
                  to="/search"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentScans.map((item) => (
                  <Link key={item.id} to={`/product/${item.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-2xl">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.date}
                        </p>
                      </div>
                      <div className={`font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Items */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Saved Items
                </h2>
                <span className="text-sm text-muted-foreground">
                  {savedItems.length} items
                </span>
              </div>
              <div className="space-y-3">
                {savedItems.map((item) => (
                  <Link key={item.id} to={`/product/${item.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-2xl">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.brand}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.score >= 70 ? (
                          <Star
                            className={`h-4 w-4 ${getScoreColor(item.score)}`}
                          />
                        ) : (
                          <AlertTriangle
                            className={`h-4 w-4 ${getScoreColor(item.score)}`}
                          />
                        )}
                        <span
                          className={`font-bold ${getScoreColor(item.score)}`}
                        >
                          {item.score}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
