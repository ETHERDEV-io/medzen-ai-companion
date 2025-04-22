import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Target, Plus, Percent, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Goal } from "@/types/health-goals";
import GoalCard from "@/components/health-goals/GoalCard";
import TrackerCard from "@/components/health-goals/TrackerCard";
import { ExtraTrackerCard } from "@/components/health-goals/ExtraTrackers";
import ProgressWheel from "@/components/health-goals/ProgressWheel";
import GoalFormDialog from "@/components/health-goals/GoalFormDialog";

const GOALS_KEY = "medzen-health-goals-v2";
const DAILY_KEY_PREFIX = "medzen-healthgoals-day";
const SETTINGS_KEY = "medzen-program-settings";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getTodayKey(base: string) {
  return `${base}:${getToday()}`;
}

export default function HealthGoals() {
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    stepsTarget: 10000,
    waterTarget: 8,
    caloriesTarget: 2000,
    proteinTarget: 120,
  });

  const [steps, setSteps] = useState(0);
  const [water, setWater] = useState(0);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [showedMotivation, setShowedMotivation] = useState(false);

  const [editingTargets, setEditingTargets] = useState({
    steps: false,
    water: false,
    calories: false,
    protein: false,
  });

  useEffect(() => {
    const setval = localStorage.getItem(SETTINGS_KEY);
    if (setval) setSettings(JSON.parse(setval));
    setSteps(Number(localStorage.getItem(getTodayKey("steps")) || settings.stepsTarget));
    setWater(Number(localStorage.getItem(getTodayKey("water")) || 0));
    setCalories(Number(localStorage.getItem(getTodayKey("calories")) || 0));
    setProtein(Number(localStorage.getItem(getTodayKey("protein")) || 0));
    const raw = localStorage.getItem(GOALS_KEY);
    setGoals(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(getTodayKey("steps"), String(steps)); }, [steps]);
  useEffect(() => { localStorage.setItem(getTodayKey("water"), String(water)); }, [water]);
  useEffect(() => { localStorage.setItem(getTodayKey("calories"), String(calories)); }, [calories]);
  useEffect(() => { localStorage.setItem(getTodayKey("protein"), String(protein)); }, [protein]);
  useEffect(() => { localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); }, [goals]);

  const today = getToday();
  const todayGoals = goals.filter(g => {
    if (!g.startDate || !g.endDate) return false;
    const afterStart = today >= g.startDate;
    const beforeEnd = today <= g.endDate;
    return afterStart && beforeEnd && (g.everyDay || g.startDate === today);
  });

  useEffect(() => {
    if (showedMotivation) return;
    const now = new Date();
    if (now.getHours() >= 23 && now.getMinutes() >= 55) {
      const allDone = todayGoals.every(g => g.completedToday);
      if (todayGoals.length === 0) return;
      if (allDone) {
        toast({ title: "Congratulations!", description: "You finished all your goals for today! 🎉" });
      } else {
        toast({ title: "Keep Going!", description: "Not every goal is complete yet. You can do it!" });
      }
      setShowedMotivation(true);
    }
  }, [showedMotivation, todayGoals, toast]);

  useEffect(() => {
    todayGoals.forEach(goal => {
      if (goal.completedToday && goal.progress === 100) {
        toast({ title: "Goal Completed!", description: `Well done on: "${goal.title}"` });
      }
    });
    if (todayGoals.some(g => !g.completedToday && g.progress < 100)) {
      if (!showedMotivation) {
        toast({ title: "Stay motivated!", description: "Come back and finish your remaining goals for today." });
        setShowedMotivation(true);
      }
    }
  }, [todayGoals, toast]);

  const openAddDialog = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleSaveGoal = (goalData: Omit<Goal, "id" | "completedToday" | "progress">) => {
    const defaultCalc = goalData.caloriesBurnTarget && goalData.caloriesBurnedToday
      ? Math.round((goalData.caloriesBurnedToday / goalData.caloriesBurnTarget) * 100)
      : 0;
    const todayVal = today >= goalData.startDate && today <= goalData.endDate;
    const isCompleted = defaultCalc >= 100 && todayVal;
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? {
                ...g,
                ...goalData,
                progress: defaultCalc,
                completedToday: isCompleted,
              }
            : g
        )
      );
      toast({ title: "Updated", description: "Goal updated." });
    } else {
      setGoals((prev) => [
        ...prev,
        {
          ...goalData,
          id: uuidv4(),
          completedToday: isCompleted,
          progress: defaultCalc,
        },
      ]);
      toast({ title: "Added", description: "Goal added." });
    }
    setEditingGoal(null);
    setIsDialogOpen(false);
  };

  const handleEditGoal = (goal: Goal) => { setEditingGoal(goal); setIsDialogOpen(true); };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter(g => g.id !== id));
    toast({ title: "Deleted", description: "Goal deleted." });
  };

  const handleSetStepsTarget = (newTarget: number) => {
    setSettings((s) => ({ ...s, stepsTarget: Math.max(1, newTarget) }));
  };
  const handleSetWaterTarget = (newTarget: number) => {
    setSettings((s) => ({ ...s, waterTarget: Math.max(1, newTarget) }));
  };
  const handleSetCaloriesTarget = (newTarget: number) => {
    setSettings((s) => ({ ...s, caloriesTarget: Math.max(1, newTarget) }));
  };
  const handleSetProteinTarget = (newTarget: number) => {
    setSettings((s) => ({ ...s, proteinTarget: Math.max(1, newTarget) }));
  };

  const numDone = todayGoals.filter(g => g.progress >= 100).length;
  const progressPercent = todayGoals.length === 0 ? 0 : Math.round((numDone / todayGoals.length) * 100);

  return (
    <div className="container mx-auto py-5 px-2 md:px-4 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="w-7 h-7 text-primary" /> Health Goals
        </h1>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Button className="gap-2 w-full md:w-auto" onClick={openAddDialog}>
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <ProgressWheel percent={progressPercent} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <TrackerCard
          type="steps"
          value={steps}
          target={settings.stepsTarget}
          onValueChange={setSteps}
          onIncrement={() => {}}
          onSetTarget={handleSetStepsTarget}
        />
        <TrackerCard
          type="water"
          value={water}
          target={settings.waterTarget}
          onValueChange={setWater}
          onIncrement={() => {}}
          onSetTarget={handleSetWaterTarget}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ExtraTrackerCard
          type="calories"
          value={calories}
          target={settings.caloriesTarget}
          onValueChange={setCalories}
          onIncrement={() => {}}
          onSetTarget={handleSetCaloriesTarget}
        />
        <ExtraTrackerCard
          type="protein"
          value={protein}
          target={settings.proteinTarget}
          onValueChange={setProtein}
          onIncrement={() => {}}
          onSetTarget={handleSetProteinTarget}
        />
      </div>

      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-4 text-blue-900 dark:text-blue-300">Today's Goals</h2>
        <GoalFormDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          editingGoal={editingGoal}
          onSave={handleSaveGoal}
        />
        {todayGoals.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center text-muted-foreground">
              <div className="mb-4 flex justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <p>No health goals for today.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todayGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
