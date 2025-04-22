
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="w-full py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
    <div
      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0"
      style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, rgba(42, 157, 143, 0.1) 0%, transparent 25%), radial-gradient(circle at 80% 70%, rgba(155, 135, 245, 0.15) 0%, transparent 30%)"
      }}
    />
    <div className="max-w-5xl mx-auto text-center relative z-10 animate-fadeIn">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        Your Personal Health Companion
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
        MedZen combines AI-powered insights with easy-to-use tools for tracking symptoms, 
        managing medications, and reaching your health goals.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="text-lg py-6 px-8">
          <Link to="/dashboard">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="text-lg py-6 px-8 group">
          <Link to="/ai-assistant">
            Try AI Assistant
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
    <div className="mt-20 max-w-4xl w-full bg-card border border-border/50 rounded-2xl shadow-xl relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0" />
      <div className="p-4 relative z-10">
        <div className="bg-card rounded-xl p-3 border border-border/50 shadow-sm" style={{ minHeight: "400px" }}>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-muted-foreground">MedZen Dashboard</div>
            <div></div>
          </div>
          <div className="space-y-3 p-4">
            <div className="h-8 bg-muted/50 rounded-md w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-muted/30 rounded-lg p-4 flex flex-col justify-between">
                <div className="h-5 bg-muted/50 rounded w-1/2"></div>
                <div className="h-12 bg-muted/20 rounded"></div>
              </div>
              <div className="h-32 bg-muted/30 rounded-lg p-4 flex flex-col justify-between">
                <div className="h-5 bg-muted/50 rounded w-1/2"></div>
                <div className="h-12 bg-muted/20 rounded"></div>
              </div>
              <div className="h-32 bg-muted/30 rounded-lg p-4 flex flex-col justify-between">
                <div className="h-5 bg-muted/50 rounded w-1/2"></div>
                <div className="h-12 bg-muted/20 rounded"></div>
              </div>
            </div>
            <div className="h-56 bg-muted/30 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
