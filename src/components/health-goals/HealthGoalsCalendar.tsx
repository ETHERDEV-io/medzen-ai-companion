
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

// The calendar expects dates in Date form!
function getTodayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

interface HealthGoalsCalendarProps {
  goals: Record<string, string>;
  customGoals: Array<{label: string, value: string, unit: string}>;
  progressLog: Record<string, Record<string, string>>;
  onDailyProgressChange: (goalKey: string, value: string) => void;
}

type GoalItem = { label: string; key: string; value: string; unit: string; planned: string; done?: string; };

function mergeGoals(goals: Record<string, string>, customGoals: Array<{label: string, value: string, unit: string}>) {
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
  goals, customGoals, progressLog, onDailyProgressChange
}: HealthGoalsCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const todayStr = getTodayStr();

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
    // if ALL preset & custom have done >= planned, then done
    return allGoals.length > 0
      && allGoals.every(g => {
        const done = stat[g.key]?.done;
        if (!done) return false;
        // Handle numeric and "-" as zero for metrics
        const doneVal = Number(done) || 0;
        const plannedVal = Number(stat[g.key].planned) || 0;
        return doneVal >= plannedVal;
      });
  }

  // Show last 14 days in calendar, highlight completed days
  const calendarDates: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    calendarDates.push(d);
  }
  const completedDates = calendarDates.filter(d => isDayCompleted(d.toISOString().slice(0, 10)));

  // Use calendar and shadcn-ui styles for a more modern look
  return (
    <Card className="bg-gradient-to-tr from-sidebar-accent/20 to-primary/10 rounded-xl border-0 shadow mb-8 p-4 md:p-5">
      <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
        <div>
          <div className="text-base font-semibold text-primary mb-2">Goal Calendar</div>
          <div className="ring-2 ring-primary/20 rounded-xl shadow-lg p-2 bg-background/80">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiers={{ completed: completedDates }}
              modifiersClassNames={{ completed: "bg-green-50 ring-2 ring-green-400 border-green-300" }}
              className="pointer-events-auto"
            />
          </div>
          <div className="mt-2 text-xs text-primary/60 px-1">Green days: all goals completed</div>
        </div>
        <div className="flex-1 min-w-[240px] bg-card/80 rounded-xl shadow-md px-4 py-3 border border-primary/10">
          {/* Goal Summary for Selected Day */}
          <div className="font-bold mb-1 text-sm text-primary/90">
            {(selected ? selected.toDateString() : "Today") + "'s Goal Progress"}
          </div>
          <ul className="grid gap-3 mb-1">
            {allGoals.map((goal, idx) => {
              const ds = selected ? selected.toISOString().slice(0, 10) : todayStr;
              const plan = goal.planned;
              const done = progressLog[ds]?.[goal.key] || "";
              const completed = Boolean(Number(done) >= Number(plan));
              // Allow input if date is today
              const editable = ds === todayStr;
              return (
                <li key={goal.key + idx} className={`flex items-center gap-2`}>
                  <span className={`w-2 h-2 rounded-full ${completed ? "bg-green-400" : "bg-gray-300"} inline-block`} />
                  <span className="font-medium text-primary/90">{goal.label}</span>
                  <span className="ml-auto text-sm flex items-end gap-1">
                    <span className={completed ? "text-green-700 font-bold" : "text-slate-500"}>
                      {done || 0} <span className="text-xs">{goal.unit}</span>
                    </span>
                    <span className="text-xs text-muted-foreground opacity-60">
                      / {plan}{goal.unit && <span> {goal.unit}</span>}
                    </span>
                    {completed && <Check className="ml-2 w-4 h-4 text-green-600" />}
                  </span>
                  {editable && (
                    <Input
                      type="number"
                      className="ml-2 w-16 py-1 px-1 h-7 bg-accent/10 border-primary/40 text-primary"
                      min={0}
                      step="any"
                      value={done}
                      onChange={e => onDailyProgressChange(goal.key, e.target.value)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          {selected && selected.toISOString().slice(0, 10) !== todayStr ? (
            <div className="text-xs text-muted-foreground ml-1 pt-2">
              You can only log today's progress.
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
