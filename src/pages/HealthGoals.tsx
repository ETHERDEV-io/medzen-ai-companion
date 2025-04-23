
import HealthGoalCard from "@/components/health-goals/HealthGoalCard";
import { useState } from "react";
import { Plus } from "lucide-react";
import GoalFormDialog from "@/components/health-goals/GoalFormDialog";
import ProgressGraph from "@/components/health-goals/ProgressGraph";
import { Button } from "@/components/ui/button";

const GOAL_PRESETS = [
  { label: "Walk", key: "walk", default: "2.5", unit: "km" },
  { label: "Heart Rate", key: "heart", default: "83", unit: "bpm" },
  { label: "Sleep", key: "sleep", default: "6", unit: "hr" },
  { label: "Water", key: "water", default: "3", unit: "Litre" },
  { label: "Gym", key: "gym", default: "-", unit: "" },
  { label: "Calories", key: "calories", default: "450", unit: "kcal" }
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
  const [customGoals, setCustomGoals] = useState<Array<{label:string,value:string,unit:string}>>(
    JSON.parse(localStorage.getItem("custom-health-goals") || "[]")
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleValueChange(key: GoalKey, val: string) {
    setGoals(prev => {
      const updated = { ...prev, [key]: val };
      localStorage.setItem("modern-health-goals", JSON.stringify(updated));
      return updated;
    });
  }

  function handleCustomGoalChange(idx: number, value: string) {
    setCustomGoals(prev => {
      const updated = prev.map((g, i) => (i === idx ? { ...g, value } : g));
      localStorage.setItem("custom-health-goals", JSON.stringify(updated));
      return updated;
    });
  }

  function handleAddCustomGoal(goal: {label: string, value: string, unit: string}) {
    setCustomGoals(prev => {
      const next = [...prev, goal];
      localStorage.setItem("custom-health-goals", JSON.stringify(next));
      return next;
    });
    setDialogOpen(false);
  }

  // Example fake progress data (past 7 days)
  const progressData = Array(7)
    .fill(0)
    .map((_, i) => ({
      date: [
        "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
      ][i],
      progress: Math.min(100, Math.round(50 + Math.random() * 50 - 10 * i)), // fake
    }));

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-gradient-to-tr from-[#1a1f2c] to-[#221f26] pb-8">
      <div className="w-full max-w-2xl mx-auto px-1 md:px-4 pt-4">
        <header className="w-full flex flex-col items-center mb-2 mt-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow mb-1">
            Health Dashboard
          </h1>
          <p className="text-sm text-white/80 mb-2 text-center font-normal">
            Your essential daily health goals – quick & easy to track. Add your own!
          </p>
        </header>

        {/* Progress Graph */}
        <ProgressGraph data={progressData} />

        <div className="flex mb-2 justify-between items-center w-full px-1">
          <h2 className="font-bold text-lg text-white/90">My Goals</h2>
          <Button
            className="flex gap-1 text-sm px-3 py-1 bg-primary/80 hover:bg-primary"
            onClick={() => setDialogOpen(true)}
            variant="outline"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>
        <GoalFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleAddCustomGoal}
        />

        <section
          className="
            grid w-full gap-4 grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            mt-4
          "
        >
          {/* Preset goals */}
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
          {/* Custom goals */}
          {customGoals.map((goal, idx) => (
            <HealthGoalCard
              key={goal.label}
              label={goal.label}
              value={goal.value}
              unit={goal.unit}
              icon="walk" // default icon for customs
              onValueChange={val => handleCustomGoalChange(idx, val)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
