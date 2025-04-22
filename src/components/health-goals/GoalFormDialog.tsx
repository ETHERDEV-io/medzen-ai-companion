
import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/health-goals";
import { useToast } from "@/hooks/use-toast";

interface GoalFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingGoal: Goal | null;
  onSave: (goal: Omit<Goal, "id" | "completedToday" | "progress">) => void;
}

export default function GoalFormDialog({ open, setOpen, editingGoal, onSave }: GoalFormDialogProps) {
  const { toast } = useToast();
  const defaultForm = {
    title: "",
    startDate: "",
    endDate: "",
    everyDay: true,
    exercise: "",
    caloriesBurnTarget: 0,
    caloriesBurnedToday: 0,
  };
  const [form, setForm] = useState<typeof defaultForm>(defaultForm);

  useEffect(() => {
    if (editingGoal) {
      setForm({
        title: editingGoal.title,
        startDate: editingGoal.startDate,
        endDate: editingGoal.endDate,
        everyDay: editingGoal.everyDay,
        exercise: editingGoal.exercise ?? "",
        caloriesBurnTarget: editingGoal.caloriesBurnTarget ?? 0,
        caloriesBurnedToday: editingGoal.caloriesBurnedToday ?? 0,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingGoal, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Title required", description: "Goal title is required.", variant: "destructive" });
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast({ title: "Date required", description: "Please pick a start and end date.", variant: "destructive" });
      return;
    }
    if (form.caloriesBurnTarget && form.caloriesBurnedToday) {
      form.caloriesBurnedToday = Math.min(form.caloriesBurnedToday, form.caloriesBurnTarget);
    }
    onSave(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingGoal ? "Edit Goal" : "Add Goal"}</DialogTitle>
          <DialogDescription>Add a new health goal with a date range and exercise</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="inline-flex items-center gap-2">
              <Input type="checkbox" name="everyDay" checked={form.everyDay} onChange={handleChange} />
              Repeat every day
            </label>
          </div>
          <div>
            <Label htmlFor="exercise">Exercise (optional)</Label>
            <Input id="exercise" name="exercise" value={form.exercise} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="caloriesBurnTarget">Calories to Burn</Label>
              <Input id="caloriesBurnTarget" name="caloriesBurnTarget" type="number"
                value={form.caloriesBurnTarget} onChange={handleNumberChange} min={0} />
            </div>
            <div>
              <Label htmlFor="caloriesBurnedToday">Burned Today</Label>
              <Input id="caloriesBurnedToday" name="caloriesBurnedToday" type="number"
                value={form.caloriesBurnedToday} onChange={handleNumberChange} min={0} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingGoal ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
