
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

function getAllGoals(goals: Record<string, string>, customGoals: Array<{ label: string; value: string; unit: string }>) {
  const presetGoalMeta: Record<string, { label: string; unit: string }> = {
    walk: { label: "Walk", unit: "km" },
    // heart is removed
    sleep: { label: "Sleep", unit: "hr" },
    water: { label: "Water", unit: "Litre" },
    gym: { label: "Gym", unit: "" },
    calories: { label: "Calories", unit: "kcal" },
  };
  const preset = Object.entries(goals)
    .filter(([key]) => key !== "heart")
    .map(([key, value]) => ({
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
  const [calendarDate, setCalendarDate] = useState(selectedDate);

  useEffect(() => {
    setCalendarDate(selectedDate);
  }, [selectedDate]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = calendarDate === todayStr;
  const allGoals = getAllGoals(goals, customGoals);

  return (
    <Card className="bg-black rounded-xl shadow mb-8 p-4 md:p-5 max-w-md mx-auto border border-white/10 dark:bg-black dark:border-white/10">
      <div>
        <div className="text-base font-semibold text-white mb-2">Pick a Date</div>
        <input
          type="date"
          className="w-full max-w-xs mb-4 rounded p-2 text-base border border-white/20 bg-black text-white"
          value={calendarDate}
          onChange={e => {
            setCalendarDate(e.target.value);
            onDateSelected(e.target.value);
          }}
          max={todayStr}
        />
      </div>
      <div className="bg-white/5 rounded-lg p-4 shadow-inner dark:bg-white/10">
        <div className="font-semibold mb-2 text-white">
          {isToday ? "Log your progress today:" : `Progress on ${calendarDate}`}
        </div>
        <ul className="space-y-3">
          {allGoals.map((goal) => {
            const goalLog = progressLog?.[calendarDate]?.[goal.key] ?? "";
            return (
              <li key={goal.key} className="flex items-center gap-3">
                <span className="font-medium min-w-[80px] text-white">{goal.label}</span>
                {isToday ? (
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    className="w-20 bg-black border-white/20 text-white"
                    value={goalLog || ""}
                    placeholder={`0${goal.unit ? " " + goal.unit : ""}`}
                    onChange={e =>
                      onDailyProgressChange(goal.key, e.target.value, todayStr)
                    }
                  />
                ) : (
                  <span className="text-white/70">
                    {goalLog || 0} {goal.unit}
                  </span>
                )}
                {goal.unit && <span className="text-xs ml-1 text-white/60">{goal.unit}</span>}
              </li>
            );
          })}
        </ul>
        {!isToday && (
          <div className="text-xs mt-3 text-white/50">Only today's data can be updated. Viewing past data only.</div>
        )}
      </div>
    </Card>
  );
}
