
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

// The calendar expects dates in Date form!
function getTodayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

interface HealthGoalsCalendarProps {
  goals: Record<string, string>;
  customGoals: Array<{label: string, value: string, unit: string}>;
  exercises: Array<{label: string, value: string, unit: string}>;
}

// Dummy completion state generator, you can link with real goal tracking
function generateGoalCompletion(goals: Record<string, string>, customGoals: any[], exercises: any[]) {
  // Let's just fake that today and yesterday had completion, rest not
  const data = {};
  let today = new Date();
  for(let i=0;i<7;i++) {
    let date = new Date(today);
    date.setDate(today.getDate() - i);
    let ds = date.toISOString().slice(0,10);
    data[ds] = {
      done: i < 2, // only today and yesterday marked done
      summary: [
        ...Object.entries(goals).map(([k, v]) => ({label: k, value:v, completed:i<2})),
        ...customGoals.map(g => ({label: g.label, value: g.value, completed:i<2})),
        ...exercises.map(g => ({label: g.label, value: g.value, completed:i<2})),
      ]
    };
  }
  return data;
}

export default function HealthGoalsCalendar({ goals, customGoals, exercises }: HealthGoalsCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const goalCompletion = generateGoalCompletion(goals, customGoals, exercises);

  // Dates to highlight (completed)
  const completedDates = Object.entries(goalCompletion)
    .filter(([date, dat]) => dat.done)
    .map(([date]) => new Date(date));

  // Get summary for selected date or today
  const summary =
    selected && goalCompletion[selected.toISOString().slice(0, 10)]
      ? goalCompletion[selected.toISOString().slice(0, 10)].summary
      : goalCompletion[getTodayStr()].summary;

  return (
    <Card className="bg-gradient-to-tr from-sidebar-accent/20 to-primary/10 rounded-xl border-0 shadow mb-8 p-4 md:p-5">
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <div className="text-base font-semibold text-primary mb-2">Calendar</div>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            modifiers={{ completed: completedDates }}
            modifiersClassNames={{ completed: "ring-2 ring-green-400" }}
            className="pointer-events-auto"
          />
        </div>
        <div className="flex-1">
          <div className="font-bold mb-1 text-sm text-primary/90">{selected ? selected.toDateString() : "Today"}'s Goal Summary</div>
          <ul className="grid gap-2 max-h-52 overflow-auto">
            {summary.map((s, idx) => (
              <li key={s.label + idx} className={`flex items-center gap-2 ${s.completed ? "text-green-500" : "text-slate-400"}`}>
                <span className={`w-2 h-2 rounded-full ${s.completed ? "bg-green-400" : "bg-gray-300"} inline-block`} />
                <span className="font-medium">{s.label}</span>
                <span className="ml-auto">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
