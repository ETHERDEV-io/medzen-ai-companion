
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">
            {editingGoal ? "Edit Goal" : "Add Goal"}
          </DialogTitle>
          <DialogDescription>
            Set a health goal with duration, track method, and progress.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Goal Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Run 2km, Read book"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
              className="text-base"
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
                className="w-5 h-5"
              />
              Repeat every day
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
                    "px-3 py-1 rounded border text-sm transition font-medium",
                    form.trackingMethod === m.value
                      ? "border-primary bg-primary/10 text-primary"
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
                  Calories to Burn <span className="text-xs text-muted-foreground">(for selected activity)</span>
                </Label>
                <Input
                  id="caloriesBurnTarget"
                  name="caloriesBurnTarget"
                  type="number"
                  value={form.caloriesBurnTarget}
                  onChange={handleNumberChange}
                  min={0}
                  placeholder="e.g. 200"
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
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              {editingGoal ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
