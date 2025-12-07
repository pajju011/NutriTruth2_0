import { FeatureCard } from "@/components/feature-card"
import { ShieldAlert, CheckCircle, FlaskConical } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <ShieldAlert className="h-7 w-7" />,
      title: "Detect Misleading Claims",
      description:
        "Our AI analyzes food advertisements to identify exaggerated or false health claims that may mislead consumers.",
    },
    {
      icon: <CheckCircle className="h-7 w-7" />,
      title: "Verify Nutrition Values",
      description:
        "Compare product labels with verified databases to ensure the nutrition information is accurate and trustworthy.",
    },
    {
      icon: <FlaskConical className="h-7 w-7" />,
      title: "Identify Harmful Ingredients",
      description:
        "Get alerts about potentially harmful additives, allergens, and ingredients that may affect your health.",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Why Choose NutriTruth?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Empowering consumers with AI-driven food insights
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
