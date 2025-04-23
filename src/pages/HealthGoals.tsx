
// Modern Health Goals overview – glass UI, mobile friendly

import HealthGoalCard from "@/components/health-goals/HealthGoalCard";
import { useState } from "react";

const GOAL_PRESETS = [
  {
    label: "Walk",
    key: "walk",
    default: "2.5",
    unit: "km"
  },
  {
    label: "Heart Rate",
    key: "heart",
    default: "83",
    unit: "bpm"
  },
  {
    label: "Sleep",
    key: "sleep",
    default: "6",
    unit: "hr"
  },
  {
    label: "Water",
    key: "water",
    default: "3",
    unit: "Litre"
  },
  {
    label: "Gym",
    key: "gym",
    default: "-",
    unit: ""
  },
  {
    label: "Calories",
    key: "calories",
    default: "450",
    unit: "kcal"
  }
] as const;

type GoalKey = typeof GOAL_PRESETS[number]["key"];
type GoalState = Record<GoalKey, string>;

function getInitialGoals(): GoalState {
  const saved = localStorage.getItem("modern-health-goals");
  if (saved) return JSON.parse(saved);
  return Object.fromEntries(GOAL_PRESETS.map(g => [g.key, g.default])) as GoalState;
}

export default function HealthGoals() {
  const [goals, setGoals] = useState<GoalState>(getInitialGoals);

  function handleValueChange(key: GoalKey, val: string) {
    setGoals(prev => {
      const updated = { ...prev, [key]: val };
      localStorage.setItem("modern-health-goals", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <main className="w-full min-h-screen px-0 py-4 flex flex-col items-center bg-gradient-to-tr from-[#1a1f2c] to-[#221f26]">
      <div className="w-full max-w-2xl mx-auto px-2 pb-4">
        <header className="w-full flex flex-col items-center mb-3 mt-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow mb-1">
            Health Dashboard
          </h1>
          <p className="text-sm text-white/80 mb-2 text-center font-normal">
            Your essential daily health goals – quick & easy to track.
          </p>
        </header>
        <section
          className="
            grid w-full gap-4 grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-3
            mt-6
            "
        >
          {GOAL_PRESETS.map(goal => (
            <HealthGoalCard
              key={goal.key}
              label={goal.label}
              value={goals[goal.key as GoalKey]}
              unit={goal.unit}
              icon={goal.key as GoalKey}
              onValueChange={val => handleValueChange(goal.key as GoalKey, val)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
