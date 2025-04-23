
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, CirclePercent } from "lucide-react";

interface HealthGoalsCalendarProps {
  goals: Record<string, string>;
  customGoals: Array<{ label: string, value: string, unit: string }>;
  progressLog: Record<string, Record<string, string>>;
  onDailyProgressChange: (goalKey: string, value: string, dateOverride?: string) => void;
  selectedDate: string;
  onDateSelected: (dateStr: string) => void;
}

type GoalItem = { label: string; key: string; value: string; unit: string; planned: string; done?: string; };

function mergeGoals(goals: Record<string, string>, customGoals: Array<{ label: string, value: string, unit: string }>) {
  // flatten preset goals (with their keys and units):
  const preset: GoalItem[] = Object.entries(goals).map(([k, v]) => {
    let presetMeta: any = undefined;
    switch (k) {
      case "walk": presetMeta = { label: "Walk", unit: "km" }; break;
      case "sleep": presetMeta = { label: "Sleep", unit: "hr" }; break;
      case "water": presetMeta = { label: "Water", unit: "Litre" }; break;
      case "gym": presetMeta = { label: "Gym", unit: "" }; break;
      case "calories": presetMeta = { label: "Calories", unit: "kcal" }; break;
      default: presetMeta = { label: k, unit: "" };
    }
    return { label: presetMeta.label, key: k, value: v, unit: presetMeta.unit, planned: v };
  });
  // append custom goals
  return [
    ...preset,
    ...customGoals.map(g => ({
      label: g.label, key: g.label, value: g.value, unit: g.unit, planned: g.value
    })),
  ];
}

export default function HealthGoalsCalendar({
  goals, customGoals, progressLog, onDailyProgressChange,
  selectedDate, onDateSelected,
}: HealthGoalsCalendarProps) {
  // Show 14 days: today and past 13 days
  const todayStr = new Date().toISOString().slice(0, 10);
  const [calendarSelected, setCalendarSelected] = useState<Date>(() => new Date(selectedDate));
  useEffect(() => {
    setCalendarSelected(new Date(selectedDate));
  }, [selectedDate]);

  // All goal definitions
  const allGoals: GoalItem[] = mergeGoals(goals, customGoals);

  // Completion info per date
  function getStatusForDate(ds: string) {
    const status: { [key: string]: { planned: string, done: string } } = {};
    for (const g of allGoals) {
      status[g.key] = {
        planned: g.planned,
        done: (progressLog[ds]?.[g.key] ?? "")
      };
    }
    return status;
  }

  // Calculate completion: consider "done" >= planned as completed
  function isDayCompleted(ds: string) {
    const stat = getStatusForDate(ds);
    return allGoals.length > 0
      && allGoals.every(g => {
        const done = stat[g.key]?.done;
        if (!done) return false;
        // Handle numeric and "-" as zero for metrics
        const doneVal = Number(done) || 0;
        const plannedVal = Number(stat[g.key].planned) || 0;
        return plannedVal === 0 ? false : doneVal >= plannedVal;
      });
  }

  // Show last 14 days
  const calendarDates: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    calendarDates.push(d);
  }
  const completedDaysSet = new Set(calendarDates.filter(d => isDayCompleted(d.toISOString().slice(0, 10))).map(d => d.toDateString()));

  // For goal progress list, use selected date or today
  const progressDS = calendarSelected ? calendarSelected.toISOString().slice(0, 10) : todayStr;
  const planAndDone = allGoals.map(goal => {
    const planned = Number(goal.planned) || 0;
    const done = Number(progressLog[progressDS]?.[goal.key] || 0);
    return { ...goal, planned, done, completed: planned > 0 ? done >= planned : false };
  });
  // Completion percent for the day (excluding 0-target goals)
  const validGoals = planAndDone.filter(g => g.planned > 0);
  const completePercent = validGoals.length === 0 ? 0 : Math.round((validGoals.filter(g => g.completed).length / validGoals.length) * 100);

  // Simplified calendar with clean styling
  return (
    <Card className="bg-white rounded-xl shadow mb-8 p-4 md:p-5 dark:bg-card">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Calendar */}
        <div>
          <div className="text-base font-semibold text-primary mb-2">Goal Calendar</div>
          <div className="rounded-lg shadow bg-white dark:bg-card p-1">
            <Calendar
              mode="single"
              selected={calendarSelected}
              onSelect={date => {
                if (date) {
                  setCalendarSelected(date);
                  onDateSelected(date.toISOString().slice(0, 10));
                }
              }}
              modifiers={{
                completed: (date) => completedDaysSet.has(date.toDateString()),
              }}
              modifiersClassNames={{
                completed: "bg-green-500 text-white",
              }}
              className="pointer-events-auto"
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground px-1">Green = all goals completed</div>
        </div>
        {/* Progress for viewed day */}
        <div className="flex-1 min-w-[240px] bg-white rounded-xl shadow-sm px-4 py-3 border dark:bg-card dark:border-gray-700">
          <div className="font-bold mb-1 text-sm">
            {(calendarSelected ? calendarSelected.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }) : "Today") + "'s Goal Progress"}
          </div>
          <ul className="grid gap-3 mb-1">
            {planAndDone.map((goal, idx) => {
              const completed = goal.completed;
              // Allow input if viewing today
              const editable = progressDS === todayStr;
              return (
                <li key={goal.key + idx} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${completed ? "bg-green-400" : "bg-gray-300"} inline-block`} />
                  <span className="font-medium">{goal.label}</span>
                  <span className="ml-auto text-sm flex items-end gap-1">
                    <span className={completed ? "text-green-700 font-bold dark:text-green-400" : "text-slate-400"}>
                      {goal.done || 0} <span className="text-xs">{goal.unit}</span>
                    </span>
                    <span className="text-xs text-muted-foreground opacity-60">
                      / {goal.planned}{goal.unit && <span> {goal.unit}</span>}
                    </span>
                    {completed && <Check className="ml-2 w-4 h-4 text-green-600" />}
                  </span>
                  {editable && (
                    <Input
                      type="number"
                      className="ml-2 w-16 py-1 px-1 h-7"
                      min={0}
                      step="any"
                      value={goal.done}
                      onChange={e => onDailyProgressChange(goal.key, e.target.value, progressDS)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2 mt-3 text-md font-semibold">
            <CirclePercent className="w-5 h-5 text-green-500" />
            {progressDS === todayStr ? "Today's " : ""}Completion: {completePercent}%
          </div>
          {progressDS !== todayStr ? (
            <div className="text-xs text-muted-foreground ml-1 pt-2">
              Only today's progress can be edited.
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
