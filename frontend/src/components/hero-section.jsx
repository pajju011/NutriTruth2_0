import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Search, ScanLine, FileSearch } from "lucide-react";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Know What You <span className="text-primary">Eat</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
            AI-powered food transparency for India
          </p>
          <form
            onSubmit={handleSearch}
            className="mt-10 flex items-center gap-2 rounded-full border border-border bg-card p-2 shadow-lg md:mx-auto md:max-w-xl"
          >
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <ActionButton
              variant="primary"
              className="px-4 py-2 text-sm"
              type="submit"
            >
              Search
            </ActionButton>
          </form>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ActionButton
              variant="primary"
              icon={<ScanLine className="h-5 w-5" />}
              className="w-full sm:w-auto"
              onClick={() => navigate("/search")}
            >
              Scan Product
            </ActionButton>
            <ActionButton
              variant="outline"
              icon={<FileSearch className="h-5 w-5" />}
              className="w-full sm:w-auto"
              onClick={() => navigate("/analyze")}
            >
              Analyze Advertisement
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
