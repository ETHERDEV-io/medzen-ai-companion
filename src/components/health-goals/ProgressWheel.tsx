
import { Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressWheelProps {
  percent: number; // 0-100
}

export default function ProgressWheel({ percent }: ProgressWheelProps) {
  // Simple SVG wheel
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="mb-2">
        <circle
          stroke="#ddd"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#6366f1"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="flex items-center gap-2 text-lg font-semibold">
        {percent}%
        <span className="text-primary">
          <Percent className="w-4 h-4" />
        </span>
      </div>
      <span className="text-xs text-muted-foreground">Goals Complete</span>
    </div>
  );
}
