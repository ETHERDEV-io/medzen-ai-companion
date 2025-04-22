
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/health-goals";
import { useToast } from "@/hooks/use-toast";

interface GoalFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingGoal: Goal | null;
  onSave: (
    goal: Omit<Goal, "id" | "completedToday" | "progress">
  ) => void;
}

export default function GoalFormDialog({
  open,
  setOpen,
  editingGoal,
  onSave,
}: GoalFormDialogProps) {
  const { toast } = useToast();
  const defaultForm = {
    title: "",
    startDate: "",
    endDate: "",
    everyDay: true,
    exercise: "",
  };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingGoal) {
      setForm({
        title: editingGoal.title ?? "",
        startDate: editingGoal.startDate ?? "",
        endDate: editingGoal.endDate ?? "",
        everyDay: editingGoal.everyDay ?? true,
        exercise: editingGoal.exercise ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingGoal, open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({
        title: "Title required",
        description: "Goal title is required.",
        variant: "destructive",
      });
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast({
        title: "Date required",
        description: "Please pick a start and end date.",
        variant: "destructive",
      });
      return;
    }
    onSave({
      ...form,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-xl border-none shadow-2xl bg-white dark:bg-zinc-900 max-w-md px-8 py-5">
        <DialogHeader>
          <DialogTitle className="mb-1 text-2xl font-extrabold text-primary">
            {editingGoal ? "Edit Goal" : "Add Goal"}
          </DialogTitle>
          <DialogDescription className="mb-3 text-base leading-snug text-indigo-700 dark:text-indigo-100">
            Set a short-term goal and track your daily progress.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
              className="mt-1 bg-gray-100 dark:bg-zinc-800"
              placeholder="e.g. Run, Meditate, Read, Walk"
            />
          </div>
          <div>
            <Label htmlFor="exercise">Short Note (optional)</Label>
            <Input
              id="exercise"
              name="exercise"
              value={form.exercise}
              onChange={handleChange}
              className="mt-1 bg-gray-100 dark:bg-zinc-800"
              placeholder="Any details for yourself?"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
                className="bg-gray-100 dark:bg-zinc-800"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                className="bg-gray-100 dark:bg-zinc-800"
              />
            </div>
          </div>
          <div>
            <label className="inline-flex items-center gap-2">
              <Input
                type="checkbox"
                name="everyDay"
                checked={form.everyDay}
                onChange={handleChange}
                className="w-5 h-5 accent-primary"
              />
              <span className="text-sm text-muted-foreground">Repeat every day</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold rounded-lg px-7 py-2 text-base">
              {editingGoal ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
