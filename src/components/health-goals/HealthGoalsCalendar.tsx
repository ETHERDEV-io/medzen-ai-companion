
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HealthGoalsCalendarProps {
  goals: Record<string, string>;
  customGoals: Array<{ label: string, value: string, unit: string }>;
  progressLog: Record<string, Record<string, string>>;
  onDailyProgressChange: (goalKey: string, value: string, dateOverride?: string) => void;
  selectedDate: string;
  onDateSelected: (dateStr: string) => void;
}

// Get all goals as an array for easier rendering
function getAllGoals(goals: Record<string, string>, customGoals: Array<{ label: string; value: string; unit: string }>) {
  const presetGoalMeta: Record<string, { label: string; unit: string }> = {
    walk: { label: "Walk", unit: "km" },
    sleep: { label: "Sleep", unit: "hr" },
    water: { label: "Water", unit: "Litre" },
    gym: { label: "Gym", unit: "" },
    calories: { label: "Calories", unit: "kcal" },
  };
  const preset = Object.entries(goals).map(([key, value]) => ({
    key,
    label: presetGoalMeta[key]?.label ?? key,
    value,
    unit: presetGoalMeta[key]?.unit ?? "",
  }));
  return [
    ...preset,
    ...customGoals.map(g => ({
      key: g.label,
      label: g.label,
      value: g.value,
      unit: g.unit,
    })),
  ];
}

export default function HealthGoalsCalendar({
  goals,
  customGoals,
  progressLog,
  onDailyProgressChange,
  selectedDate,
  onDateSelected,
}: HealthGoalsCalendarProps) {
  // Date state for calendar
  const [calendarDate, setCalendarDate] = useState(selectedDate);

  useEffect(() => {
    setCalendarDate(selectedDate);
  }, [selectedDate]);

  const todayStr = new Date().toISOString().slice(0, 10);
  // Only allow logging goal progress for today
  const isToday = calendarDate === todayStr;

  // All goal definitions for display
  const allGoals = getAllGoals(goals, customGoals);

  // Show the simple date picker and today's goal log area
  return (
    <Card className="bg-white rounded-xl shadow mb-8 p-4 md:p-5 max-w-md mx-auto dark:bg-card">
      <div>
        <div className="text-base font-semibold text-primary mb-2">Pick a Date</div>
        <input
          type="date"
          className="w-full max-w-xs mb-4 bg-background border border-input rounded p-2 text-base dark:bg-background dark:text-foreground"
          value={calendarDate}
          onChange={e => {
            setCalendarDate(e.target.value);
            onDateSelected(e.target.value);
          }}
          max={todayStr}
        />
      </div>
      <div className="bg-accent/20 rounded-lg p-4 shadow-inner">
        <div className="font-semibold mb-2 text-primary">
          {calendarDate === todayStr ? "Log your progress today:" : `Progress on ${calendarDate}`}
        </div>
        <ul className="space-y-3">
          {allGoals.map((goal) => {
            // Show an input only if today, otherwise just show the value
            const goalLog = progressLog?.[calendarDate]?.[goal.key] ?? "";
            return (
              <li key={goal.key} className="flex items-center gap-3">
                <span className="font-medium min-w-[80px]">{goal.label}</span>
                {isToday ? (
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    className="w-20"
                    value={goalLog || ""}
                    placeholder={`0${goal.unit ? " " + goal.unit : ""}`}
                    onChange={e =>
                      onDailyProgressChange(goal.key, e.target.value, todayStr)
                    }
                  />
                ) : (
                  <span className="text-muted-foreground">
                    {goalLog || 0} {goal.unit}
                  </span>
                )}
                {goal.unit && <span className="text-xs ml-1 text-muted-foreground">{goal.unit}</span>}
              </li>
            );
          })}
        </ul>
        {!isToday && (
          <div className="text-xs mt-3 text-muted-foreground">Only today's data can be updated.</div>
        )}
      </div>
    </Card>
  );
}
