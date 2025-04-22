
import { Edit2, Trash, Check, Gauge, Dumbbell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/health-goals";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  function progressColor(progress: number) {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-indigo-500";
  }

  return (
    <Card className="relative border border-indigo-200 dark:border-indigo-700/40 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/40 dark:to-purple-900/40 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex gap-2 items-center text-indigo-900 dark:text-indigo-100">{goal.title}</CardTitle>
        {goal.exercise && (
          <CardDescription className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4 text-indigo-500" />
            <span className="font-medium text-indigo-700 dark:text-indigo-300">{goal.exercise}</span>
          </CardDescription>
        )}
        {goal.caloriesBurnTarget && (
          <CardDescription className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{goal.caloriesBurnTarget} kcal target</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor(goal.progress)}`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <span>
              {goal.progress < 100
                ? `${goal.progress}%`
                : (
                  <span className="inline-flex items-center gap-1 text-green-500 font-medium">
                    Completed <Check className="w-3 h-3" />
                  </span>
                )}
            </span>
            {goal.caloriesBurnedToday !== undefined && goal.caloriesBurnTarget !== undefined && (
              <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                {goal.caloriesBurnedToday} / {goal.caloriesBurnTarget} kcal
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button variant="ghost" size="icon" onClick={() => onEdit(goal)} className="h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100">
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100" onClick={() => onDelete(goal.id)}>
          <Trash className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
