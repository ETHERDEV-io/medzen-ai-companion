
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dumbbell, Plus, Target } from "lucide-react";
import ProgressWheel from "@/components/health-goals/ProgressWheel";
import GoalFormDialog from "@/components/health-goals/GoalFormDialog";
import { useToast } from "@/hooks/use-toast";
import { Goal } from "@/types/health-goals";
import SimpleTracker from "@/components/health-goals/SimpleTracker";
import GoalCard from "@/components/health-goals/GoalCard";
import { Button } from "@/components/ui/button";

const GOALS_KEY = "medzen-health-goals-v2";
const SETTINGS_KEY = "medzen-program-settings";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function HealthGoals() {
  const { toast } = useToast();

  // Simple settings/state for user-tracked numbers
  const [trackers, setTrackers] = useState([
    { key: "steps", label: "Steps", value: 0, target: 10000, unit: "steps", color: "indigo" },
    { key: "water", label: "Water", value: 0, target: 8, unit: "cups", color: "sky" },
    { key: "calories", label: "Calories", value: 0, target: 2000, unit: "kcal", color: "orange" },
    { key: "protein", label: "Protein", value: 0, target: 120, unit: "g", color: "green" },
  ]);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Persistent load/save for trackers
  useEffect(() => {
    const saved = localStorage.getItem("simple-health-tracking");
    saved && setTrackers(JSON.parse(saved));
    const raw = localStorage.getItem(GOALS_KEY);
    setGoals(raw ? JSON.parse(raw) : []);
  }, []);
  useEffect(() => {
    localStorage.setItem("simple-health-tracking", JSON.stringify(trackers));
  }, [trackers]);
  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  // Overall progress for "wheel"
  const flatProgress = trackers.reduce((acc, t) => {
    const percent = Math.min(100, Math.round((t.value / (t.target || 1)) * 100));
    return acc + percent;
  }, 0);
  const progressPercent = Math.round(flatProgress / trackers.length);

  // Minimal goal handling
  const today = getToday();
  const todayGoals = goals.filter(g => {
    if (!g.startDate || !g.endDate) return false;
    const afterStart = today >= g.startDate;
    const beforeEnd = today <= g.endDate;
    return afterStart && beforeEnd && (g.everyDay || g.startDate === today);
  });

  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleSaveGoal = (goalData: Omit<Goal, "id" | "completedToday" | "progress">) => {
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? { ...g, ...goalData }
            : g
        )
      );
      toast({ title: "Goal updated." });
    } else {
      setGoals((prev) => [
        ...prev,
        {
          ...goalData,
          id: uuidv4(),
          completedToday: false,
          progress: 0,
        },
      ]);
      toast({ title: "Goal added." });
    }
    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter(g => g.id !== id));
    toast({ title: "Goal deleted." });
  };

  const handleChangeTracker = (index: number, value: number) => {
    setTrackers(t =>
      t.map((tracker, i) => (i === index ? { ...tracker, value } : tracker))
    );
  };

  const handleChangeTarget = (index: number, target: number) => {
    setTrackers(t =>
      t.map((tracker, i) => (i === index ? { ...tracker, target } : tracker))
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-2">
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/70 dark:to-purple-900/70 rounded-xl p-6 mb-8 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-900 dark:text-indigo-100 mb-1">
          <Dumbbell className="w-7 h-7 text-indigo-600" />
          My Health Goals
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 my-4">
          <ProgressWheel percent={progressPercent} />
          <div className="flex-1 grid grid-cols-1 gap-2">
            {trackers.map((tracker, idx) => (
              <SimpleTracker
                key={tracker.key}
                label={tracker.label}
                color={tracker.color}
                unit={tracker.unit}
                value={tracker.value}
                target={tracker.target}
                onValueChange={val => handleChangeTracker(idx, val)}
                onTargetChange={val => handleChangeTarget(idx, val)}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-xl text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" /> Goals for Today
          </h2>
          <Button onClick={handleOpenAddGoal} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus /> Add Goal
          </Button>
        </div>
        <GoalFormDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          editingGoal={editingGoal}
          onSave={handleSaveGoal}
        />
        {todayGoals.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8 border border-dashed border-indigo-300 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 mt-4">
            <p>No extra goals for today.</p>
            <Button variant="outline" onClick={handleOpenAddGoal} className="mt-2">
              <Plus className="w-4 h-4 mr-1" /> Add Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 mt-3">
            {todayGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                simple
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
