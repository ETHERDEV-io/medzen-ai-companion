
import { useState } from "react";
import { Edit2, Trash, Check } from "lucide-react";
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
    if (progress >= 90) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-600";
  }

  return (
    <Card className="relative border dark:border-blue-700/40 bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-950/40 dark:to-blue-900/40 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex gap-2 items-center">{goal.title}</CardTitle>
        <CardDescription>
          {goal.category && <span>{goal.category}</span>}
        </CardDescription>
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
                  <span className="inline-flex items-center gap-1 text-green-500">
                    Completed <Check className="w-3 h-3" />
                  </span>
                )}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(goal.id)}>
          <Trash className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
