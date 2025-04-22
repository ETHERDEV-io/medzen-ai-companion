
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash, Edit2, Pill, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

const MEDICATIONS_KEY = "medzen-medications";

const defaultForm: Omit<Medication, "id"> = {
  name: "",
  dosage: "",
  frequency: "",
  startDate: "",
  endDate: "",
};

export default function Medications() {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(MEDICATIONS_KEY);
    if (stored) setMedications(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  }, [medications]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddDialog = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Name required", description: "Medication name is required.", variant: "destructive" });
      return;
    }
    if (editingId) {
      setMedications((prev) =>
        prev.map((med) => (med.id === editingId ? { ...med, ...form } : med))
      );
      toast({ title: "Updated", description: "Medication updated." });
    } else {
      setMedications((prev) => [
        ...prev,
        { ...form, id: uuidv4() }
      ]);
      toast({ title: "Added", description: "Medication added." });
    }
    setIsDialogOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleEdit = (med: Medication) => {
    setForm({ ...med });
    setEditingId(med.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMedications((prev) => prev.filter(med => med.id !== id));
    toast({ title: "Deleted", description: "Medication deleted." });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Pill className="w-6 h-6" /> Medications
        </h1>
        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="w-4 h-4" /> Add Medication
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Medication" : "Add Medication"}</DialogTitle>
            <DialogDescription>Enter medication details</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" name="dosage" value={form.dosage} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Input id="frequency" name="frequency" value={form.frequency} onChange={handleChange} placeholder="e.g. Once daily" />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" value={form.endDate ?? ""} onChange={handleChange} />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {medications.length === 0 ? (
        <Card className="mt-12">
          <CardContent className="py-12 text-center text-muted-foreground">
            <div className="mb-4 flex justify-center">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <p>No medications added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((med) => (
            <Card key={med.id} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center">{med.name}</CardTitle>
                <CardDescription>
                  {med.dosage && <span>{med.dosage}</span>} {med.frequency && <span>· {med.frequency}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pb-3">
                {med.startDate && (
                  <div className="text-xs text-muted-foreground">
                    Start: {med.startDate}
                  </div>
                )}
                {med.endDate && (
                  <div className="text-xs text-muted-foreground">
                    End: {med.endDate}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(med)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(med.id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
