
import HealthGoalCard from "@/components/health-goals/HealthGoalCard";
import { useState } from "react";
import { Plus, Edit } from "lucide-react";
import GoalFormDialog from "@/components/health-goals/GoalFormDialog";
import ProgressGraph from "@/components/health-goals/ProgressGraph";
import { Button } from "@/components/ui/button";
import EditGoalDialog from "@/components/health-goals/EditGoalDialog";

// Main goals, now without "Heart Rate"
const GOAL_PRESETS = [
  { label: "Walk", key: "walk", default: "2.5", unit: "km", type: "goal" },
  { label: "Sleep", key: "sleep", default: "6", unit: "hr", type: "goal" },
  { label: "Water", key: "water", default: "3", unit: "Litre", type: "goal" },
  { label: "Gym", key: "gym", default: "-", unit: "", type: "goal" },
  { label: "Calories", key: "calories", default: "450", unit: "kcal", type: "goal" }
] as const;

// Key types
type GoalKey = typeof GOAL_PRESETS[number]["key"];
type GoalState = Record<GoalKey, string>;

// Helper: get initial data from localStorage or use defaults
function getInitialGoals(): GoalState {
  const saved = localStorage.getItem("modern-health-goals");
  if (saved) return JSON.parse(saved);
  return Object.fromEntries(GOAL_PRESETS.map(g => [g.key, g.default])) as GoalState;
}
function getInitialExercises(): Array<{label: string, value: string, unit: string}> {
  return JSON.parse(localStorage.getItem("modern-health-exercises") || "[]");
}

export default function HealthGoals() {
  const [goals, setGoals] = useState<GoalState>(getInitialGoals);
  const [customGoals, setCustomGoals] = useState<Array<{label:string,value:string,unit:string}>>(
    JSON.parse(localStorage.getItem("custom-health-goals") || "[]")
  );
  const [exercises, setExercises] = useState<Array<{label:string,value:string,unit:string}>>(getInitialExercises());
  const [dialogOpen, setDialogOpen] = useState(false);

  // New: Manage which goal is being edited
  const [editData, setEditData] = useState<{goal: any, idx: number|null, type: "preset"|"custom"|"exercise"|null}>({goal: null, idx: null, type: null});
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  function handleExerciseChange(idx: number, value: string) {
    setExercises(prev => {
      const updated = prev.map((g, i) => (i === idx ? { ...g, value } : g));
      localStorage.setItem("modern-health-exercises", JSON.stringify(updated));
      return updated;
    });
  }

  function handleAddCustomGoal(goal: {label: string, value: string, unit: string, type?: string}) {
    // If this is labeled as exercise, treat separately
    if (goal.type === "exercise") {
      setExercises(prev => {
        const next = [...prev, {label: goal.label, value: goal.value, unit: goal.unit}];
        localStorage.setItem("modern-health-exercises", JSON.stringify(next));
        return next;
      });
    } else {
      setCustomGoals(prev => {
        const next = [...prev, goal];
        localStorage.setItem("custom-health-goals", JSON.stringify(next));
        return next;
      });
    }
    setDialogOpen(false);
  }

  // Editing code for pop-up dialog
  function handleEditGoal(goal: any, idx: number|null, type: "preset"|"custom"|"exercise") {
    setEditData({goal, idx, type});
    setEditDialogOpen(true);
  }
  function handleGoalEditSave(newData: {label: string, value: string, unit: string}) {
    if (editData.type === "preset" && editData.goal) {
      // Update preset value
      setGoals(prev => {
        const updated = {...prev, [editData.goal.key]: newData.value};
        localStorage.setItem("modern-health-goals", JSON.stringify(updated));
        return updated;
      });
    } else if (editData.type === "custom" && editData.idx !== null) {
      setCustomGoals(prev => {
        const updated = prev.map((g, i) => (i === editData.idx ? {...g, ...newData} : g));
        localStorage.setItem("custom-health-goals", JSON.stringify(updated));
        return updated;
      });
    } else if (editData.type === "exercise" && editData.idx !== null) {
      setExercises(prev => {
        const updated = prev.map((g, i) => (i === editData.idx ? {...g, ...newData} : g));
        localStorage.setItem("modern-health-exercises", JSON.stringify(updated));
        return updated;
      });
    }
    setEditDialogOpen(false);
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
        {/* Add Goal Dialog */}
        <GoalFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleAddCustomGoal}
        />

        {/* Edit Goal Dialog */}
        <EditGoalDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          initialData={editData.goal}
          onSave={handleGoalEditSave}
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
              onEdit={() => handleEditGoal(goal, null, "preset")}
            />
          ))}
          {/* Custom goals */}
          {customGoals.map((goal, idx) => (
            <HealthGoalCard
              key={goal.label}
              label={goal.label}
              value={goal.value}
              unit={goal.unit}
              icon="walk"
              onValueChange={val => handleCustomGoalChange(idx, val)}
              onEdit={() => handleEditGoal(goal, idx, "custom")}
            />
          ))}
        </section>

        {/* Exercises section */}
        <div className="mt-10 mb-2 px-1 flex items-center justify-between">
          <h2 className="font-bold text-lg text-white/90">Exercises</h2>
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </Button>
        </div>
        <section
          className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          {exercises.map((exercise, idx) => (
            <HealthGoalCard
              key={exercise.label + idx}
              label={exercise.label}
              value={exercise.value}
              unit={exercise.unit}
              icon="dumbbell"
              onValueChange={val => handleExerciseChange(idx, val)}
              onEdit={() => handleEditGoal(exercise, idx, "exercise")}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
