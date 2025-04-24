import HealthGoalCard from "@/components/health-goals/HealthGoalCard";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import GoalFormDialog from "@/components/health-goals/GoalFormDialog";
import ProgressGraph from "@/components/health-goals/ProgressGraph";
import { Button } from "@/components/ui/button";
import EditGoalDialog from "@/components/health-goals/EditGoalDialog";
import HealthGoalsCalendar from "@/components/health-goals/HealthGoalsCalendar";

const GOAL_PRESETS = [
  { label: "Walk", key: "walk", default: "2.5", unit: "km", type: "goal" },
  { label: "Sleep", key: "sleep", default: "6", unit: "hr", type: "goal" },
  { label: "Water", key: "water", default: "3", unit: "Litre", type: "goal" },
  { label: "Gym", key: "gym", default: "-", unit: "", type: "goal" },
  { label: "Calories", key: "calories", default: "450", unit: "kcal", type: "goal" }
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

  const [progressLog, setProgressLog] = useState<Record<string, Record<string, string>>>(
    JSON.parse(localStorage.getItem("modern-health-progress-log") || "{}")
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editData, setEditData] = useState<{goal: any, idx: number|null, type: "preset"|"custom"|null}>({goal: null, idx: null, type: null});
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

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

  function handleDailyProgressChange(goalKey: string, value: string, dateOverride?: string) {
    const dateStr = dateOverride || new Date().toISOString().slice(0, 10);
    setProgressLog(prev => {
      const next = {...prev, [dateStr]: {...(prev[dateStr] || {}), [goalKey]: value}};
      localStorage.setItem("modern-health-progress-log", JSON.stringify(next));
      return next;
    });
  }

  function handleDeleteGoal(idx: number, type: "preset" | "custom", key?: string) {
    if (type === "custom") {
      setCustomGoals(prev => {
        const updated = prev.filter((_, i) => i !== idx);
        localStorage.setItem("custom-health-goals", JSON.stringify(updated));
        return updated;
      });

      // Also remove this goal from progress logs
      const goalLabel = customGoals[idx].label;
      setProgressLog(prev => {
        const updated = Object.fromEntries(
          Object.entries(prev).map(([date, goals]) => [
            date,
            Object.fromEntries(
              Object.entries(goals).filter(([k]) => k !== goalLabel)
            ),
          ])
        );
        localStorage.setItem("modern-health-progress-log", JSON.stringify(updated));
        return updated;
      });
    } else if (type === "preset" && key) {
      setGoals(prev => {
        const preset = GOAL_PRESETS.find(g => g.key === key);
        if (!preset) return prev;
        const updated = {...prev, [preset.key]: preset.default};
        localStorage.setItem("modern-health-goals", JSON.stringify(updated));
        return updated;
      });

      // Reset progress for this preset goal
      setProgressLog(prev => {
        const updated = Object.fromEntries(
          Object.entries(prev).map(([date, goals]) => [
            date,
            Object.fromEntries(
              Object.entries(goals).filter(([k]) => k !== key)
            ),
          ])
        );
        localStorage.setItem("modern-health-progress-log", JSON.stringify(updated));
        return updated;
      });
    }
  }

  function handleAddCustomGoal(goal: {label: string, value: string, unit: string}) {
    setCustomGoals(prev => {
      const next = [...prev, goal];
      localStorage.setItem("custom-health-goals", JSON.stringify(next));
      return next;
    });
    setDialogOpen(false);
  }

  function handleEditGoal(goal: any, idx: number|null, type: "preset"|"custom") {
    setEditData({goal, idx, type});
    setEditDialogOpen(true);
  }

  function handleGoalEditSave(newData: {label: string, value: string, unit: string}) {
    if (editData.type === "preset" && editData.goal) {
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
    }
    setEditDialogOpen(false);
  }

  function getDateRangeData(days: number) {
    const arr: Array<{date: string, progress: number}> = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const entries = [
        ...Object.entries(goals).map(([k, v]) => ({ key: k, planned: Number(v), done: Number(progressLog[ds]?.[k] || 0) })),
        ...customGoals.map((g) => ({
          key: g.label,
          planned: Number(g.value),
          done: Number(progressLog[ds]?.[g.label] || 0),
        }))
      ];
      const validEntries = entries.filter(entry => entry.planned > 0);
      const numGoals = validEntries.length;
      const completed = validEntries.filter(g => g.done >= g.planned).length;
      arr.push({
        date: d.toLocaleDateString(undefined, { weekday: "short" }),
        progress: numGoals === 0 ? 0 : Math.round((completed / numGoals) * 100)
      });
    }
    return arr;
  }
  const progressData = getDateRangeData(7);

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-secondary via-background to-primary/40 pb-8">
      <div className="w-full max-w-4xl mx-auto px-2 md:px-6 pt-4">
        <header className="w-full flex flex-col items-center mb-2 mt-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow mb-1">
            Health Dashboard
          </h1>
          <p className="text-base text-white/80 mb-4 text-center font-normal">
            Your daily goals, progress, and tracker.<br />
            All-in-one and always up-to-date!
          </p>
        </header>

        <section className="mb-5">
          <ProgressGraph data={progressData} />
          <HealthGoalsCalendar
            goals={goals}
            customGoals={customGoals}
            progressLog={progressLog}
            onDailyProgressChange={handleDailyProgressChange}
            selectedDate={selectedDate}
            onDateSelected={(dateStr: string) => setSelectedDate(dateStr)}
          />
        </section>

        <div className="flex mb-2 justify-between items-center w-full px-1">
          <h2 className="font-bold text-xl text-white/90">My Goals</h2>
          <Button
            className="flex gap-1 text-sm px-3 py-1 bg-primary/80 hover:bg-primary"
            onClick={() => setDialogOpen(true)}
            variant="outline"
            type="button"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>
        <GoalFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleAddCustomGoal}
        />
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
          {GOAL_PRESETS.map(goal => (
            <div key={goal.key} className="relative group">
              <HealthGoalCard
                label={goal.label}
                value={goals[goal.key as GoalKey]}
                unit={goal.unit}
                icon={goal.key as GoalKey}
                onValueChange={val => handleValueChange(goal.key as GoalKey, val)}
                onEdit={() => handleEditGoal(goal, null, "preset")}
                useDialogEdit
              />
              <button
                className="absolute top-2 right-2 z-10 opacity-70 group-hover:opacity-100 text-red-500 hover:text-red-700 transition p-1 rounded-full bg-black/60"
                title="Delete goal (reset to default)"
                onClick={() => handleDeleteGoal(null, "preset", goal.key)}
                type="button"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {customGoals.map((goal, idx) => (
            <div key={goal.label + idx} className="relative group">
              <HealthGoalCard
                label={goal.label}
                value={goal.value}
                unit={goal.unit}
                icon="walk"
                onValueChange={val => handleCustomGoalChange(idx, val)}
                onEdit={() => handleEditGoal(goal, idx, "custom")}
                useDialogEdit
              />
              <button
                className="absolute top-2 right-2 z-10 opacity-70 group-hover:opacity-100 text-red-500 hover:text-red-700 transition p-1 rounded-full bg-black/60"
                title="Delete custom goal"
                onClick={() => handleDeleteGoal(idx, "custom")}
                type="button"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
