import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({ icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-3 text-lg font-semibold text-card-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
