
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Target, Plus, Trash, Edit2, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number; // 0-100
}

const GOALS_KEY = "medzen-health-goals";
const defaultForm: Omit<Goal, "id"> = { title: "", category: "", progress: 0 };

export default function HealthGoals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(GOALS_KEY);
    if (stored) setGoals(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

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

  function progressColor(progress: number) {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-600";
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6" /> Health Goals
        </h1>
        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="w-4 h-4" /> Add Goal
        </Button>
      </div>
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
        <Card className="mt-12">
          <CardContent className="py-12 text-center text-muted-foreground">
            <div className="mb-4 flex justify-center">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <p>No health goals yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="relative">
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
    </div>
  );
}
