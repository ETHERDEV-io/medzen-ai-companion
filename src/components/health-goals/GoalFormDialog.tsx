
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
import clsx from "clsx";

interface GoalFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingGoal: Goal | null;
  onSave: (
    goal: Omit<Goal, "id" | "completedToday" | "progress">
  ) => void;
}

const TRACKING_METHODS = [
  { label: "Calories burned", value: "calories" },
  { label: "Custom progress (%)", value: "percent" },
];

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
    caloriesBurnTarget: 0,
    caloriesBurnedToday: 0,
    progressTodayPercent: 0,
    trackingMethod: "calories" as "calories" | "percent",
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
        progressTodayPercent: editingGoal.caloriesBurnTarget
          ? 0
          : editingGoal.progress ?? 0,
        trackingMethod: editingGoal.caloriesBurnTarget ? "calories" : "percent",
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingGoal, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      // Only access checked if this is an input element of checkbox type
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleTrackingMethod = (value: "calories" | "percent") => {
    setForm((prev) => ({
      ...prev,
      trackingMethod: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    let saveObj: any = {
      title: form.title,
      startDate: form.startDate,
      endDate: form.endDate,
      everyDay: form.everyDay,
      exercise: form.exercise ?? "",
    };

    if (form.trackingMethod === "calories") {
      saveObj.caloriesBurnTarget = form.caloriesBurnTarget;
      saveObj.caloriesBurnedToday = form.caloriesBurnedToday;
    } else {
      saveObj.caloriesBurnTarget = undefined;
      saveObj.caloriesBurnedToday = undefined;
      saveObj.progress = form.progressTodayPercent || 0;
    }

    onSave(saveObj);
    setOpen(false);
  };

  // Improved styling classes for the dialog popup and fields
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-xl border-none shadow-2xl bg-white dark:bg-zinc-900 max-w-md px-8 py-5">
        <DialogHeader>
          <DialogTitle className="mb-1 text-2xl font-extrabold tracking-tight text-primary">
            {editingGoal ? "Edit Goal" : "Add Goal"}
          </DialogTitle>
          <DialogDescription className="mb-3 text-base leading-snug">
            Set a health goal with custom duration, progress tracking and exercise. Track calories burned, percent complete, and repeat daily if needed.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="title" className="font-semibold">
              Goal Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Run 2km, Read, Meditate"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
              className="text-base bg-gray-100 dark:bg-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate" className="font-semibold">
                Start Date
              </Label>
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
              <Label htmlFor="endDate" className="font-semibold">
                End Date
              </Label>
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

          {/* Tracking method */}
          <div>
            <Label className="font-semibold mb-1">Track Progress By</Label>
            <div className="flex gap-2 mt-1">
              {TRACKING_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={clsx(
                    "px-3 py-1 rounded-md border text-sm shadow-sm",
                    form.trackingMethod === m.value
                      ? "border-primary bg-primary/10 text-primary font-extrabold"
                      : "border-border bg-background"
                  )}
                  onClick={() => handleTrackingMethod(m.value as any)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {form.trackingMethod === "calories" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="caloriesBurnTarget" className="font-semibold">
                  Calories to Burn{" "}
                  <span className="text-xs text-muted-foreground">(for selected activity)</span>
                </Label>
                <Input
                  id="caloriesBurnTarget"
                  name="caloriesBurnTarget"
                  type="number"
                  value={form.caloriesBurnTarget}
                  onChange={handleNumberChange}
                  min={0}
                  placeholder="e.g. 200"
                  className="bg-gray-100 dark:bg-zinc-800"
                />
              </div>
              <div>
                <Label htmlFor="caloriesBurnedToday" className="font-semibold">
                  Calories Burned Today
                </Label>
                <Input
                  id="caloriesBurnedToday"
                  name="caloriesBurnedToday"
                  type="number"
                  value={form.caloriesBurnedToday}
                  onChange={handleNumberChange}
                  min={0}
                  placeholder="How much did you burn today?"
                  className="bg-gray-100 dark:bg-zinc-800"
                />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="progressTodayPercent" className="font-semibold">
                Progress Today (%) <span className="text-xs text-muted-foreground">(0–100)</span>
              </Label>
              <Input
                id="progressTodayPercent"
                name="progressTodayPercent"
                type="number"
                value={form.progressTodayPercent}
                onChange={handleNumberChange}
                min={0}
                max={100}
                placeholder="How much of your goal did you complete?"
                className="bg-gray-100 dark:bg-zinc-800"
              />
            </div>
          )}

          <div>
            <Label htmlFor="exercise" className="font-semibold">
              Exercise <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="exercise"
              name="exercise"
              placeholder="e.g. Jogging, Yoga"
              value={form.exercise}
              onChange={handleChange}
              className="bg-gray-100 dark:bg-zinc-800"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg"
            >
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

// src/components/health-goals/GoalFormDialog.tsx is now 307 lines long. Consider refactoring it into smaller components/files for maintainability.
