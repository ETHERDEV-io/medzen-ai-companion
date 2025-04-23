
import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogFooter, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GoalFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: {label: string, unit: string, value: string}) => void;
}

export default function GoalFormDialog({ open, onClose, onSave }: GoalFormDialogProps) {
  const [form, setForm] = useState({ label: "", value: "", unit: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label || !form.value) return;
    onSave(form);
    setForm({label: "", value: "", unit: ""});
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a Custom Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Goal"
            name="label"
            placeholder="e.g., Yoga"
            autoFocus
            value={form.label}
            onChange={handleChange}
            required
          />
          <div className="flex gap-3">
            <Input
              type="number"
              name="value"
              placeholder="Value"
              value={form.value}
              onChange={handleChange}
              required
            />
            <Input
              name="unit"
              placeholder="Unit (e.g., min)"
              value={form.unit}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
