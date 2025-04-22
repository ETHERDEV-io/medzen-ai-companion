
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Target, Plus, Award, Brain, Activity, Heart, Calendar, Droplet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Goal, PremiumFeature } from "@/types/health-goals";
import GoalCard from "@/components/health-goals/GoalCard";
import TrackerCard from "@/components/health-goals/TrackerCard";
import FeatureCard from "@/components/health-goals/FeatureCard";
import GoalFormDialog from "@/components/health-goals/GoalFormDialog";

// --- Constants ---
const GOALS_KEY = "medzen-health-goals";
const STEP_KEY = "medzen-steps";
const WATER_KEY = "medzen-water";
const STEP_DAILY_TARGET = 10000;
const WATER_DAILY_TARGET = 8;
const ACTIVE_FEATURES_KEY = "medzen-active-features";

// --- Utility ---
function getTodayKey(key: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `${key}:${today}`;
}

const premiumFeatures: PremiumFeature[] = [
  {
    id: "templates",
    title: "Personalized Templates",
    description: "Pre-built goal frameworks for exercise, nutrition, sleep, mental wellness, and more.",
    icon: Award,
    category: "goal-management",
  },
  {
    id: "suggestions",
    title: "AI-Powered Suggestions",
    description: "Intelligent goal recommendations based on your health patterns.",
    icon: Brain,
    category: "goal-management",
  },
  {
    id: "difficulty",
    title: "Progressive Difficulty",
    description: "Tiered challenge levels with adaptive adjustments based on performance.",
    icon: Activity,
    category: "goal-management",
  },
  {
    id: "smart",
    title: "SMART Goal Framework",
    description: "Create goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.",
    icon: Target,
    category: "goal-management",
  },
  {
    id: "dashboard",
    title: "Interactive Dashboards",
    description: "Dynamic visual representations of progress across multiple goals.",
    icon: Activity, 
    category: "visualization",
  },
  {
    id: "trends",
    title: "Trend Analysis",
    description: "Historical data visualization with pattern recognition.",
    icon: Activity,
    category: "visualization",
  },
  {
    id: "milestones",
    title: "Milestone Celebrations",
    description: "Animated achievements and digital badges for completed goals.",
    icon: Award,
    category: "visualization",
  },
  {
    id: "habit",
    title: "Habit Building Mechanics",
    description: "Implementation intention prompts and obstacle planning.",
    icon: Brain,
    category: "behavioral",
  },
  {
    id: "microgoals",
    title: "Microgoal Architecture",
    description: "Breaking larger goals into achievable daily actions.",
    icon: Target,
    category: "behavioral",
  },
  {
    id: "identity",
    title: "Identity-Based Framing",
    description: "Connecting goals to personal values and self-perception.",
    icon: Heart,
    category: "behavioral",
  },
  {
    id: "heatmaps",
    title: "Activity Heat Maps",
    description: "Calendar-based intensity visualization.",
    icon: Calendar,
    category: "visual",
  },
  {
    id: "progress-wheels",
    title: "Progress Wheels",
    description: "Intuitive circular progress indicators with percentage completion.",
    icon: Activity,
    category: "visual",
  },
];

// --- Main Component ---
export default function HealthGoals() {
  const { toast } = useToast();

  // Health Goals
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Trackers
  const [steps, setSteps] = useState<number>(0);
  const [water, setWater] = useState<number>(0);
  
  // Features
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

  // -- LOAD --
  useEffect(() => {
    // Health goals
    const stored = localStorage.getItem(GOALS_KEY);
    if (stored) setGoals(JSON.parse(stored));
    
    // Steps
    const stepsVal = Number(localStorage.getItem(getTodayKey(STEP_KEY)) || "0");
    setSteps(stepsVal);
    
    // Water
    const waterVal = Number(localStorage.getItem(getTodayKey(WATER_KEY)) || "0");
    setWater(waterVal);
    
    // Active features
    const activeFeatsStored = localStorage.getItem(ACTIVE_FEATURES_KEY);
    if (activeFeatsStored) {
      setActiveFeatures(JSON.parse(activeFeatsStored));
    } else {
      // Set default active features
      const defaults = ["templates", "dashboard", "habit", "heatmaps"];
      setActiveFeatures(defaults);
      localStorage.setItem(ACTIVE_FEATURES_KEY, JSON.stringify(defaults));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(getTodayKey(STEP_KEY), String(steps));
  }, [steps]);

  useEffect(() => {
    localStorage.setItem(getTodayKey(WATER_KEY), String(water));
  }, [water]);
  
  useEffect(() => {
    localStorage.setItem(ACTIVE_FEATURES_KEY, JSON.stringify(activeFeatures));
  }, [activeFeatures]);

  // --- Goal Handlers ---
  const openAddDialog = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleSaveGoal = (goalData: Omit<Goal, "id">) => {
    if (editingGoal) {
      setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? { ...g, ...goalData } : g)));
      toast({ title: "Updated", description: "Goal updated." });
    } else {
      setGoals((prev) => [...prev, { ...goalData, id: uuidv4() }]);
      toast({ title: "Added", description: "Goal added." });
    }
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGoals((prev) => prev.filter(g => g.id !== id));
    toast({ title: "Deleted", description: "Goal deleted." });
  };

  // --- Track Handlers ---
  const handleStepChange = (value: number) => {
    setSteps(value);
  };

  const handleFeatureToggle = (featureId: string) => {
    setActiveFeatures(prev => {
      if (prev.includes(featureId)) {
        return prev.filter(id => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
    
    toast({ 
      title: activeFeatures.includes(featureId) ? "Feature Disabled" : "Feature Enabled", 
      description: activeFeatures.includes(featureId) 
        ? "The feature has been turned off." 
        : "The feature has been activated!" 
    });
  };

  // --- Render Helpers ---
  const renderFeaturesByCategory = (category: string) => {
    const categoryFeatures = premiumFeatures.filter(f => f.category === category);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {categoryFeatures.map(feature => (
          <div key={feature.id} className="relative" onClick={() => handleFeatureToggle(feature.id)}>
            <FeatureCard
              icon={<feature.icon className="w-5 h-5 text-primary" />}
              title={feature.title}
              description={feature.description}
              isActive={activeFeatures.includes(feature.id)}
            />
            <Button 
              variant={activeFeatures.includes(feature.id) ? "default" : "outline"}
              size="sm" 
              className="absolute top-3 right-3"
            >
              {activeFeatures.includes(feature.id) ? "Active" : "Enable"}
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // --- Layout ---
  return (
    <div className="container mx-auto py-6 px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="w-7 h-7 text-primary" /> Health Goals
        </h1>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Button className="gap-2 w-full md:w-auto" onClick={openAddDialog}>
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>
      </div>

      {/* Trackers Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <TrackerCard 
          type="steps"
          value={steps}
          target={STEP_DAILY_TARGET}
          onValueChange={handleStepChange}
          onIncrement={(amt) => setSteps(prev => Math.max(0, Math.min(STEP_DAILY_TARGET * 2, prev + amt)))}
        />
        
        <TrackerCard 
          type="water"
          value={water}
          target={WATER_DAILY_TARGET}
          onValueChange={setWater}
          onIncrement={(amt) => setWater(prev => Math.max(0, Math.min(WATER_DAILY_TARGET * 2, prev + amt)))}
        />
      </div>

      {/* Health Goals Section */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-4 text-blue-900 dark:text-blue-300">Personal Goals</h2>
        
        <GoalFormDialog 
          open={isDialogOpen} 
          setOpen={setIsDialogOpen} 
          editingGoal={editingGoal} 
          onSave={handleSaveGoal} 
        />
        
        {goals.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center text-muted-foreground">
              <div className="mb-4 flex justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <p>No health goals yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Premium Features Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Enhanced Features
        </h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300">Goal Management</h3>
          {renderFeaturesByCategory("goal-management")}
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300">Progress Visualization</h3>
          {renderFeaturesByCategory("visualization")}
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300">Behavioral Science</h3>
          {renderFeaturesByCategory("behavioral")}
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300">Visual Experience</h3>
          {renderFeaturesByCategory("visual")}
        </div>
      </section>
    </div>
  );
}
