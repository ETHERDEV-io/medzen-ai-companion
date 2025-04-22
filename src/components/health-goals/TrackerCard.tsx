
import { Activity, Droplet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface TrackerCardProps {
  type: "steps" | "water";
  value: number;
  target: number;
  onValueChange: (value: number) => void;
  onIncrement: (amount: number) => void;
  onSetTarget: (value: number) => void;
}

export default function TrackerCard({
  type,
  value,
  target,
  onValueChange,
  onSetTarget,
}: TrackerCardProps) {
  const percent = Math.min(100, Math.round((value / target) * 100));
  const isSteps = type === "steps";
  const [editingTarget, setEditingTarget] = useState(false);
  const [inputTargetValue, setInputTargetValue] = useState(target);

  const handleChange = (newVal: number[]) => {
    onValueChange(Array.isArray(newVal) ? newVal[0] : newVal);
  };

  const handleSetTarget = (e: React.FormEvent) => {
    e.preventDefault();
    onSetTarget(Number(inputTargetValue));
    setEditingTarget(false);
  };

  return (
    <Card
      className={`bg-gradient-to-tr ${
        isSteps
          ? "from-indigo-100/80 to-blue-300/30 dark:from-indigo-700/40 dark:to-blue-900/60 border-2 border-indigo-300/40 dark:border-indigo-600/40"
          : "from-sky-100/80 to-cyan-300/30 dark:from-sky-700/40 dark:to-cyan-900/60 border-2 border-sky-300/40 dark:border-sky-600/40"
      } shadow-lg`}
    >
      <CardHeader className="flex-row gap-3 items-center pb-2">
        {isSteps ? (
          <Activity className="w-7 h-7 text-indigo-700 dark:text-indigo-300" />
        ) : (
          <Droplet className="w-7 h-7 text-sky-700 dark:text-sky-300" />
        )}
        <CardTitle className={isSteps ? "text-indigo-800 dark:text-indigo-100" : "text-sky-800 dark:text-sky-100"}>
          {isSteps ? "Step Tracker" : "Water Tracker"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start space-y-2">
          <div className="text-3xl font-semibold flex items-center gap-1">
            {isSteps ? value.toLocaleString() : value}
            <span className="text-base text-muted-foreground ml-2">
              /
              {editingTarget ? (
                <form onSubmit={handleSetTarget} className="inline-block ml-1">
                  <Input
                    type="number"
                    value={inputTargetValue}
                    min={1}
                    onChange={e => setInputTargetValue(e.target.valueAsNumber)}
                    className="inline-block w-20 h-7 px-2 text-base border border-primary rounded-md"
                  />
                  <button type="submit" className="ml-1 text-primary font-semibold text-xs">Save</button>
                </form>
              ) : (
                <button
                  className="underline text-primary px-1 bg-transparent"
                  onClick={() => setEditingTarget(true)}
                  type="button"
                  aria-label="Edit target"
                  tabIndex={0}
                >
                  {isSteps ? target.toLocaleString() : target}
                </button>
              )}
              {isSteps ? " steps" : " cups"}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden my-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isSteps ? "bg-indigo-500" : "bg-sky-500"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="w-full flex items-end">
            <Slider
              value={[value]}
              min={0}
              max={target * 2}
              step={isSteps ? 100 : 1}
              onValueChange={handleChange}
              className={`${isSteps ? "bg-indigo-200 dark:bg-indigo-950" : "bg-sky-100 dark:bg-sky-900"} w-full`}
            />
          </div>
          <div className="text-xs text-muted-foreground">{percent}% of daily goal</div>
        </div>
      </CardContent>
    </Card>
  );
}
