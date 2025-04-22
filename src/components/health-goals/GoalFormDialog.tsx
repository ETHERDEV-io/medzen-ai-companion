
import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Goal } from "@/types/health-goals";
import { useToast } from "@/hooks/use-toast";

interface GoalFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingGoal: Goal | null;
  onSave: (goal: Omit<Goal, "id">) => void;
}

export default function GoalFormDialog({ open, setOpen, editingGoal, onSave }: GoalFormDialogProps) {
  const { toast } = useToast();
  const defaultForm: Omit<Goal, "id"> = { title: "", category: "", progress: 0 };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingGoal) {
      setForm({
        title: editingGoal.title,
        category: editingGoal.category,
        progress: editingGoal.progress
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingGoal, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProgressChange = (v: number[]) => {
    setForm((prev) => ({ ...prev, progress: v[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Title required", description: "Goal title is required.", variant: "destructive" });
      return;
    }
    onSave(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingGoal ? "Edit Goal" : "Add Goal"}</DialogTitle>
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
