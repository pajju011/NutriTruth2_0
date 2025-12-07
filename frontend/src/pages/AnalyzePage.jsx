import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export function AnalyzePage() {
  const [imageFile, setImageFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile && !textInput) return;

    setAnalyzing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock result
    setResult({
      riskScore: 65,
      misleadingClaims: [
        {
          claim: "100% Natural",
          issue: "Contains artificial preservatives",
          severity: "high",
        },
        {
          claim: "Sugar Free",
          issue: "Contains maltodextrin which spikes blood sugar",
          severity: "medium",
        },
        {
          claim: "Heart Healthy",
          issue: "High sodium content contradicts this claim",
          severity: "high",
        },
      ],
      nutritionContradictions: [
        "Advertised as low-calorie but contains 350 kcal per serving",
        "Claims high protein but only has 3g per serving",
      ],
      verifiedClaims: ["Gluten Free - Verified", "Vegetarian - Verified"],
    });
    setAnalyzing(false);
  };

  const getSeverityColor = (severity) => {
    if (severity === "high") return "text-red-500 bg-red-500/10";
    if (severity === "medium") return "text-yellow-500 bg-yellow-500/10";
    return "text-blue-500 bg-blue-500/10";
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "text-red-500";
    if (score >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getRiskLabel = (score) => {
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Moderate Risk";
    return "Low Risk";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analyze Advertisement
          </h1>
          <p className="text-muted-foreground mb-8">
            Upload an ad image or paste ad text to detect misleading claims
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Image Upload */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Image
                </h2>
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      imageFile
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {imageFile ? (
                      <div>
                        <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-card-foreground">
                          {imageFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drop image here or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </CardContent>
            </Card>

            {/* Text Input */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Paste Ad Text
                </h2>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste advertisement text here..."
                  className="w-full h-32 p-3 rounded-xl border border-border bg-muted/50 text-card-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </CardContent>
            </Card>
          </div>

          {/* Analyze Button */}
          <div className="text-center mb-8">
            <ActionButton
              variant="primary"
              onClick={handleAnalyze}
              disabled={(!imageFile && !textInput) || analyzing}
              className="px-8"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                "Analyze Advertisement"
              )}
            </ActionButton>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Risk Score */}
              <Card className="border border-border">
                <CardContent className="p-6 text-center">
                  <h2 className="text-lg font-semibold text-card-foreground mb-2">
                    Risk Score
                  </h2>
                  <div
                    className={`text-5xl font-bold ${getRiskColor(
                      result.riskScore
                    )}`}
                  >
                    {result.riskScore}
                  </div>
                  <p
                    className={`text-sm mt-1 ${getRiskColor(result.riskScore)}`}
                  >
                    {getRiskLabel(result.riskScore)}
                  </p>
                </CardContent>
              </Card>

              {/* Misleading Claims */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Misleading Claims Detected
                  </h2>
                  <div className="space-y-3">
                    {result.misleadingClaims.map((item, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg ${getSeverityColor(
                          item.severity
                        )}`}
                      >
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">"{item.claim}"</p>
                            <p className="text-sm opacity-80 mt-1">
                              {item.issue}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nutrition Contradictions */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">
                    Nutrition Contradictions
                  </h2>
                  <div className="space-y-2">
                    {result.nutritionContradictions.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-yellow-500"
                      >
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-1" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Verified Claims */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">
                    Verified Claims
                  </h2>
                  <div className="space-y-2">
                    {result.verifiedClaims.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-green-500"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
