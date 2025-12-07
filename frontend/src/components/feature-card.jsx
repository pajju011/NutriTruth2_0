import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({ icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-card-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
