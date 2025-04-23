
import { useState, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goalData: { name: string; target: number; current: number }) => void;
}

export default function GoalFormDialog({ open, onOpenChange, onSave }: GoalFormDialogProps) {
  const [goalName, setGoalName] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: goalName,
      target: Number(targetValue),
      current: Number(currentValue)
    });
    resetForm();
  };

  const resetForm = () => {
    setGoalName("");
    setTargetValue("");
    setCurrentValue("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Health Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Goal Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Daily Steps"
                autoFocus={true}
                value={goalName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setGoalName(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">
                Target Value
              </Label>
              <Input
                id="target"
                name="target"
                type="number"
                placeholder="e.g., 10000"
                value={targetValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetValue(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current" className="text-right">
                Current Value
              </Label>
              <Input
                id="current"
                name="current"
                type="number"
                placeholder="e.g., 5000"
                value={currentValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentValue(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
