
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Target, Plus, Trash, Edit2, Check, Activity, Droplet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

// --- Types & Constants ---
interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number; // 0-100
}
const GOALS_KEY = "medzen-health-goals";
const defaultForm: Omit<Goal, "id"> = { title: "", category: "", progress: 0 };

const STEP_KEY = "medzen-steps";
const WATER_KEY = "medzen-water";
const STEP_DAILY_TARGET = 10000;
const WATER_DAILY_TARGET = 8;

// --- Utility ---
function getTodayKey(key: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `${key}:${today}`;
}

// --- Main ---
export default function HealthGoals() {
  const { toast } = useToast();

  // Health Goals
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Step & Water Trackers
  const [steps, setSteps] = useState<number>(0);
  const [water, setWater] = useState<number>(0);

  // -- LOAD --
  useEffect(() => {
    // Health goals
    const stored = localStorage.getItem(GOALS_KEY);
    if (stored) setGoals(JSON.parse(stored));
    // Steps
    const stepsVal = Number(localStorage.getItem(getTodayKey(STEP_KEY)) || "0");
    setSteps(stepsVal);
    // Water
    const waterVal = Number(localStorage.getItem(getTodayKey(WATER_KEY)) || "0");
    setWater(waterVal);
  }, []);
  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);
  useEffect(() => {
    localStorage.setItem(getTodayKey(STEP_KEY), String(steps));
  }, [steps]);
  useEffect(() => {
    localStorage.setItem(getTodayKey(WATER_KEY), String(water));
  }, [water]);

  // --- Handlers (Goals) ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleProgressChange = (v: number[]) => {
    setForm((prev) => ({ ...prev, progress: v[0] }));
  };
  const openAddDialog = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsDialogOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Title required", description: "Goal title is required.", variant: "destructive" });
      return;
    }
    if (editingId) {
      setGoals((prev) => prev.map((g) => (g.id === editingId ? { ...g, ...form } : g)));
      toast({ title: "Updated", description: "Goal updated." });
    } else {
      setGoals((prev) => [...prev, { ...form, id: uuidv4() }]);
      toast({ title: "Added", description: "Goal added." });
    }
    setIsDialogOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };
  const handleEdit = (g: Goal) => {
    setForm({ ...g });
    setEditingId(g.id);
    setIsDialogOpen(true);
  };
  const handleDelete = (id: string) => {
    setGoals((prev) => prev.filter(g => g.id !== id));
    toast({ title: "Deleted", description: "Goal deleted." });
  };

  // --- Step & Water Handlers ---
  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value.replace(/[^0-9]/g, ""));
    setSteps(Math.max(0, Math.min(STEP_DAILY_TARGET * 2, raw)));
  };
  const addStep = (amt: number) => setSteps((s) => Math.max(0, Math.min(STEP_DAILY_TARGET * 2, s + amt)));
  const stepPercent = Math.min(100, Math.round((steps / STEP_DAILY_TARGET) * 100));
  const handleWaterClick = (amt: number) => setWater((w) => Math.max(0, Math.min(WATER_DAILY_TARGET * 2, w + amt)));
  const waterPercent = Math.min(100, Math.round((water / WATER_DAILY_TARGET) * 100));

  // --- Colors ---
  function progressColor(progress: number) {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-600";
  }

  // --- Layout ---
  return (
    <div className="container mx-auto py-6 px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="w-7 h-7 text-primary" /> Health Goals
        </h1>
        <Button className="gap-2 w-full md:w-auto" onClick={openAddDialog}>
          <Plus className="w-4 h-4" /> Add Goal
        </Button>
      </div>

      {/* Trackers Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Steps */}
        <Card className="bg-gradient-to-tr from-blue-100/80 to-blue-400/30 dark:from-blue-700/40 dark:to-blue-900/60 border-2 border-blue-300/40 dark:border-blue-600/40 shadow-lg">
          <CardHeader className="flex-row gap-3 items-center pb-2">
            <Activity className="w-7 h-7 text-blue-700 dark:text-blue-200" />
            <CardTitle className="text-blue-800 dark:text-blue-100">Step Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start space-y-2">
              <span className="text-3xl font-semibold">{steps.toLocaleString()} <span className="text-base text-muted-foreground">/ {STEP_DAILY_TARGET}</span></span>
              <div className="w-full h-3 rounded-full bg-blue-100 dark:bg-blue-900/40 overflow-hidden my-1">
                <div className="h-full rounded-full transition-all duration-500 bg-blue-400" style={{ width: `${stepPercent}%` }} />
              </div>
              <div className="flex items-center gap-2 w-full">
                <Button size="icon" variant="secondary" onClick={() => addStep(-500)} className="rounded-full">-500</Button>
                <Input 
                  className="w-24 text-center border-gray-300 dark:border-gray-700" 
                  type="number" 
                  min={0}
                  max={STEP_DAILY_TARGET * 2}
                  value={steps} 
                  onChange={handleStepChange} 
                />
                <Button size="icon" variant="secondary" onClick={() => addStep(500)} className="rounded-full">+500</Button>
              </div>
              <div className="text-xs text-muted-foreground">{stepPercent}% of daily goal</div>
            </div>
          </CardContent>
        </Card>
        {/* Water */}
        <Card className="bg-gradient-to-tr from-teal-100/80 to-teal-300/30 dark:from-teal-700/40 dark:to-teal-900/60 border-2 border-teal-300/40 dark:border-teal-600/40 shadow-lg">
          <CardHeader className="flex-row gap-3 items-center pb-2">
            <Droplet className="w-7 h-7 text-teal-700 dark:text-teal-200" />
            <CardTitle className="text-teal-800 dark:text-teal-100">Water Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start space-y-2">
              <span className="text-3xl font-semibold">{water}</span>
              <span className="text-muted-foreground text-base">cups / {WATER_DAILY_TARGET} cups goal</span>
              <div className="flex items-center gap-2 w-full my-2">
                <Button size="icon" variant="secondary" onClick={() => handleWaterClick(-1)} className="rounded-full">-1</Button>
                <Button size="icon" variant="secondary" onClick={() => handleWaterClick(1)} className="rounded-full">+1</Button>
              </div>
              <div className="w-full h-3 rounded-full bg-teal-100 dark:bg-teal-900/40 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500 bg-teal-400" style={{ width: `${waterPercent}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">{waterPercent}% of daily goal</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Goals Section */}
      <section>
        <h2 className="font-semibold text-lg mb-4 text-blue-900 dark:text-blue-300">Personal Goals</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Goal" : "Add Goal"}</DialogTitle>
              <DialogDescription>Set your health goal</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={form.category} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="progress">Progress</Label>
                <Slider min={0} max={100} step={1} defaultValue={[form.progress]} value={[form.progress]} onValueChange={handleProgressChange} />
                <div className="text-xs text-muted-foreground mt-1">{form.progress}%</div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Add"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {goals.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center text-muted-foreground">
              <div className="mb-4 flex justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <p>No health goals yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="relative border dark:border-blue-700/40 bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-950/40 dark:to-blue-900/40 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex gap-2 items-center">{goal.title}</CardTitle>
                  <CardDescription>
                    {goal.category && <span>{goal.category}</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                      <span>
                        {goal.progress < 100
                          ? `${goal.progress}%`
                          : (
                            <span className="inline-flex items-center gap-1 text-green-500">
                              Completed <Check className="w-3 h-3" />
                            </span>
                          )}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(goal.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
