
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, format, parseISO } from "date-fns";

// Utility to get all preset and custom goals for the log form
function getAllGoals(goals: Record<string, string>, customGoals: Array<{ label: string; value: string; unit: string }>) {
  const presetGoalMeta: Record<string, { label: string; unit: string }> = {
    walk: { label: "Walk", unit: "km" },
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

// Simple Calendar Grid (shows days of current month, highlights selected)
function CalendarGrid({
  value,
  onChange,
  highlightColor = "bg-purple-600",
  className,
}: {
  value: string;
  onChange: (dateStr: string) => void;
  highlightColor?: string;
  className?: string;
}) {
  const [month, setMonth] = useState(() => value ? parseISO(value) : new Date());

  useEffect(() => {
    // if value's month is not in the current, update
    const newVal = value ? parseISO(value) : new Date();
    if (month.getMonth() !== newVal.getMonth() || month.getFullYear() !== newVal.getFullYear()) {
      setMonth(newVal);
    }
  }, [value]);

  const firstDayOfMonth = startOfMonth(month);
  const lastDayOfMonth = endOfMonth(month);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });
  const today = new Date();

  // Build 6 weeks grid
  let days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center mb-2 justify-between">
        <button
          className="text-white/70 p-1 rounded hover:bg-white/10"
          aria-label="Previous month"
          onClick={() => setMonth(subMonths(month, 1))}
          type="button"
        >
          <CalendarIcon className="w-4 h-4 rotate-180" />
        </button>
        <span className="text-white font-semibold text-base">{format(month, "MMMM yyyy")}</span>
        <button
          className="text-white/70 p-1 rounded hover:bg-white/10"
          aria-label="Next month"
          onClick={() => setMonth(addMonths(month, 1))}
          type="button"
          disabled={format(addMonths(month, 1), "yyyy-MM") > format(today, "yyyy-MM")}
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-xs mb-1 gap-y-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="text-white/60 text-center font-medium">{d}</div>
        ))}
        {days.map((curr, idx) => {
          const dStr = format(curr, "yyyy-MM-dd");
          const isSelected = value === dStr;
          const inMonth = isSameMonth(curr, month);
          const isToday = isSameDay(curr, today);
          return (
            <button
              key={idx}
              disabled={!inMonth || dStr > format(today, "yyyy-MM-dd")}
              onClick={() => onChange(dStr)}
              className={cn(
                "h-8 w-8 text-center rounded-full mx-auto flex items-center justify-center transition-all",
                !inMonth ? "text-white/20 cursor-not-allowed" : "cursor-pointer text-white/90",
                isSelected && highlightColor + " text-white font-bold",
                isToday && !isSelected && "border border-white/30",
                !isSelected && !isToday && "hover:bg-white/10"
              )}
              aria-label={format(curr, "yyyy-MM-dd")}
              type="button"
            >
              {curr.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface HealthGoalsCalendarProps {
  goals: Record<string, string>;
  customGoals: Array<{ label: string, value: string, unit: string }>;
  progressLog: Record<string, Record<string, string>>;
  onDailyProgressChange: (goalKey: string, value: string, dateOverride?: string) => void;
  selectedDate: string;
  onDateSelected: (dateStr: string) => void;
}

export default function HealthGoalsCalendar({
  goals,
  customGoals,
  progressLog,
  onDailyProgressChange,
  selectedDate,
  onDateSelected,
}: HealthGoalsCalendarProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const allGoals = getAllGoals(goals, customGoals);
  const isToday = selectedDate === todayStr;

  return (
    <Card className="bg-black rounded-xl shadow mb-8 p-4 md:p-5 max-w-md mx-auto border border-white/10 dark:bg-black dark:border-white/10">
      <div>
        <div className="text-base font-semibold text-white mb-2">Pick a Date</div>
        <CalendarGrid
          value={selectedDate}
          onChange={onDateSelected}
          highlightColor="bg-purple-600"
        />
      </div>
      <div className="bg-white/5 rounded-lg p-4 shadow-inner dark:bg-white/10 mt-4">
        <div className="font-semibold mb-2 text-white">
          {isToday ? "Log your progress today:" : `Progress on ${selectedDate}`}
        </div>
        <ul className="space-y-3">
          {allGoals.map((goal) => {
            const goalLog = progressLog?.[selectedDate]?.[goal.key] ?? "";
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
          <div className="text-xs mt-3 text-white/50">
            Only today's data can be updated. Viewing past data only.
          </div>
        )}
      </div>
    </Card>
  );
}
