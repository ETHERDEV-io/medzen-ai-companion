
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { label?: string, value?: string, unit?: string };
  onSave: (data: { label: string; value: string; unit: string }) => void;
}

export default function EditGoalDialog({
  open,
  onOpenChange,
  initialData,
  onSave
}: EditGoalDialogProps) {
  const [label, setLabel] = useState(initialData?.label || "");
  const [value, setValue] = useState(initialData?.value || "");
  const [unit, setUnit] = useState(initialData?.unit || "");

  useEffect(() => {
    if (open) {
      setLabel(initialData?.label || "");
      setValue(initialData?.value || "");
      setUnit(initialData?.unit || "");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ label, value, unit });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={label}
                onChange={e => setLabel(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                name="value"
                value={value}
                onChange={e => setValue(e.target.value)}
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
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="submit" className="mr-2">Save</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
