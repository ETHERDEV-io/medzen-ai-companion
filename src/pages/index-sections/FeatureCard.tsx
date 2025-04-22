
import React from "react";
import { cn } from "@/lib/utils";
import useScrollReveal from "./useScrollReveal";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  const [ref, isIntersecting] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={cn(
        "bg-card text-card-foreground rounded-xl p-6 shadow-md border border-border/50 transition-all duration-500 transform",
        isIntersecting
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4 p-3 bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
