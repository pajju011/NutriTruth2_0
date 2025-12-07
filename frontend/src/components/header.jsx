import { ActionButton } from "@/components/ui/action-button";
import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">
            NutriTruth <span className="text-primary">2.0</span>
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <ActionButton variant="outline" className="px-5 py-2 text-sm">
            Login
          </ActionButton>
          <ActionButton variant="primary" className="px-5 py-2 text-sm">
            Sign Up
          </ActionButton>
        </nav>
      </div>
    </header>
  );
}
