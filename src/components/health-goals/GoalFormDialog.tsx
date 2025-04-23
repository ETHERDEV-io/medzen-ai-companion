
import { useState, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (goalData: { label: string; value: string; unit: string }) => void;
}

export default function GoalFormDialog({ open, onOpenChange, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goalData: { label: string; value: string; unit: string }) => void;
}) {
  const [goalName, setGoalName] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      label: goalName,
      value: value,
      unit: unit
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setGoalName("");
    setValue("");
    setUnit("");
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
              <Label htmlFor="value" className="text-right">
                Current Value
              </Label>
              <Input
                id="value"
                name="value"
                placeholder="e.g., 5000"
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
                placeholder="e.g., steps"
                value={unit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUnit(e.target.value)}
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
