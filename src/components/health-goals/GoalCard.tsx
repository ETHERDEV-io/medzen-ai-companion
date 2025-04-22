
import { Edit, Trash } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/health-goals";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  simple?: boolean;
}

export default function GoalCard({ goal, onEdit, onDelete, simple }: GoalCardProps) {
  return (
    <Card className="relative border border-indigo-200 dark:border-indigo-700/40 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/60 dark:to-purple-900/60 shadow-md hover:shadow-lg transition-shadow">
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold mb-1 text-indigo-900 dark:text-indigo-100">{goal.title}</span>
          {goal.exercise && (
            <span className="text-xs text-indigo-600 dark:text-indigo-200">{goal.exercise}</span>
          )}
          <div className="h-2 mt-2 bg-muted rounded-full w-full overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${goal.progress || 0}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>
              Progress: {goal.progress ? `${goal.progress}%` : "0%"}
            </span>
            {goal.completedToday && <span className="text-green-500 font-semibold">Complete!</span>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  );
}
