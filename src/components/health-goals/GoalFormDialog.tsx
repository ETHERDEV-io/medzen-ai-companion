
import { useState, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GoalFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goalData: { label: string; value: string; unit: string; type?: string }) => void;
  hideExerciseField?: boolean;
};

export default function GoalFormDialog({ open, onOpenChange, onSave, hideExerciseField = false }: GoalFormDialogProps) {
  const [goalName, setGoalName] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [isExercise, setIsExercise] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      label: goalName,
      value: value,
      unit: unit,
      type: isExercise ? "exercise" : undefined,
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setGoalName("");
    setValue("");
    setUnit("");
    setIsExercise(false);
  };

  return (
    <Dialog open={open} onOpenChange={open => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New {isExercise ? "Exercise" : "Goal"}</DialogTitle>
            <DialogDescription>
              Create a new health goal to track your progress
            </DialogDescription>
          </DialogHeader>
          
          {!hideExerciseField && (
            <div className="mb-2 flex items-center gap-2">
              <label className="flex items-center cursor-pointer gap-2 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={isExercise}
                  onChange={e => setIsExercise(e.target.checked)}
                />{" "}
                This is an exercise
              </label>
            </div>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={isExercise ? "e.g., Push Ups" : "e.g., Daily Steps"}
                autoFocus={true}
                value={goalName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setGoalName(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Current Value
              </Label>
              <Input
                id="value"
                name="value"
                placeholder={isExercise ? "e.g., 30" : "e.g., 5000"}
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit
              </Label>
              <Input
                id="unit"
                name="unit"
                placeholder={isExercise ? "e.g., reps" : "e.g., steps"}
                value={unit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUnit(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
