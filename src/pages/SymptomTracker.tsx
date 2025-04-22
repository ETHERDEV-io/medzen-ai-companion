
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, parseISO } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Edit2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Symptom, SymptomFormData } from "@/types/health";
import { cn } from "@/lib/utils";

const SYMPTOMS_STORAGE_KEY = "medzen-symptoms";

const defaultFormData: SymptomFormData = {
  name: "",
  severity: 5,
  notes: "",
  date: format(new Date(), "yyyy-MM-dd"),
};

const SymptomTracker = () => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [formData, setFormData] = useState<SymptomFormData>({ ...defaultFormData });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  // Load symptoms from localStorage on mount
  useEffect(() => {
    const storedSymptoms = localStorage.getItem(SYMPTOMS_STORAGE_KEY);
    if (storedSymptoms) {
      try {
        setSymptoms(JSON.parse(storedSymptoms));
      } catch (error) {
        console.error("Error parsing symptoms from localStorage:", error);
      }
    }
  }, []);

  // Save symptoms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(symptoms));
  }, [symptoms]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle severity slider change
  const handleSeverityChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, severity: value[0] }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a symptom name",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Update existing symptom
      setSymptoms((prev) =>
        prev.map((symptom) =>
          symptom.id === editingId
            ? {
                ...symptom,
                name: formData.name,
                severity: formData.severity,
                notes: formData.notes,
                date: formData.date,
              }
            : symptom
        )
      );
      
      toast({
        title: "Symptom Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Add new symptom
      const newSymptom: Symptom = {
        id: uuidv4(),
        name: formData.name,
        severity: formData.severity,
        notes: formData.notes,
        date: formData.date,
        createdAt: new Date().toISOString(),
      };

      setSymptoms((prev) => [...prev, newSymptom]);
      
      toast({
        title: "Symptom Added",
        description: `${formData.name} has been added successfully.`,
      });
    }

    // Reset form
    setFormData({ ...defaultFormData });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  // Delete a symptom
  const handleDelete = (id: string) => {
    setSymptoms((prev) => prev.filter((symptom) => symptom.id !== id));
    
    toast({
      title: "Symptom Deleted",
      description: "The symptom has been deleted successfully.",
    });
  };

  // Edit a symptom
  const handleEdit = (symptom: Symptom) => {
    setFormData({
      name: symptom.name,
      severity: symptom.severity,
      notes: symptom.notes,
      date: symptom.date,
    });
    setEditingId(symptom.id);
    setIsDialogOpen(true);
  };

  // Get severity color
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "bg-green-500";
    if (severity <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Group symptoms by date
  const groupedSymptoms = symptoms.reduce<Record<string, Symptom[]>>((acc, symptom) => {
    const date = symptom.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(symptom);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedSymptoms).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Symptom Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track and monitor your symptoms over time
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Symptom</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Symptom" : "Add New Symptom"}</DialogTitle>
              <DialogDescription>
                {editingId 
                  ? "Update the details of your symptom."
                  : "Enter the details of the symptom you're experiencing."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Symptom Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Headache, Fever, etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="pr-10"
                  />
                  <Calendar className="absolute top-2.5 right-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="severity">Severity (1-10)</Label>
                  <span className="text-sm font-medium">{formData.severity}</span>
                </div>
                <Slider
                  id="severity"
                  defaultValue={[formData.severity]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={handleSeverityChange}
                  className="pt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional details about this symptom..."
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setFormData({ ...defaultFormData });
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Update Symptom" : "Add Symptom"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full sm:w-[400px] mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          {symptoms.length === 0 ? (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No symptoms recorded</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Start tracking your symptoms to monitor your health over time.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Your First Symptom</Button>
                  </DialogTrigger>
                  {/* Dialog content is defined above */}
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="space-y-3">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(parseISO(date), "MMMM d, yyyy")}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedSymptoms[date].map((symptom) => (
                    <Card key={symptom.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{symptom.name}</CardTitle>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEdit(symptom)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDelete(symptom.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          {format(parseISO(symptom.date), "MMMM d, yyyy")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center mb-2">
                          <span className="text-sm mr-2">Severity:</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", getSeverityColor(symptom.severity))}
                              style={{ width: `${symptom.severity * 10}%` }}
                            />
                          </div>
                          <span className="text-sm ml-2">{symptom.severity}</span>
                        </div>
                        {symptom.notes && (
                          <div className="mt-2">
                            <span className="text-sm text-muted-foreground">Notes:</span>
                            <p className="text-sm whitespace-pre-wrap">{symptom.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                View your symptoms by date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Calendar view is under development and will be available soon.</p>
                <p className="mt-2">Please use the List view to manage your symptoms.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SymptomTracker;
