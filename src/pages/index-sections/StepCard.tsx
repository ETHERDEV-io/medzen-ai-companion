
import React from "react";
import { cn } from "@/lib/utils";
import useScrollReveal from "./useScrollReveal";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  delay?: number;
}

const StepCard = ({ number, title, description, delay = 0 }: StepCardProps) => {
  const [ref, isIntersecting] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-5 items-start transition-all duration-500 transform",
        isIntersecting
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex-shrink-0 rounded-full bg-accent/20 w-10 h-10 flex items-center justify-center font-bold text-accent-foreground">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default StepCard;
