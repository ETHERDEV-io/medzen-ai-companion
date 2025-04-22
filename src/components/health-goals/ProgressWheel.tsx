
import { Percent } from "lucide-react";

interface ProgressWheelProps {
  percent: number; // 0-100
}

export default function ProgressWheel({ percent }: ProgressWheelProps) {
  // SVG wheel settings
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Color based on progress
  const getProgressColor = () => {
    if (percent >= 100) return "#10b981"; // green-500
    if (percent >= 75) return "#6366f1"; // indigo-500
    if (percent >= 50) return "#8b5cf6"; // violet-500
    if (percent >= 25) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#e2e8f0" // slate-200
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={getProgressColor()}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
            style={{ filter: "drop-shadow(0px 0px 3px rgba(99, 102, 241, 0.5))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{percent}%</span>
          <span className="text-xs text-indigo-600 dark:text-indigo-300">completed</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 text-base font-medium text-indigo-800 dark:text-indigo-200">
        Goals Complete <Percent className="w-4 h-4 text-indigo-500" />
      </div>
    </div>
  );
}
