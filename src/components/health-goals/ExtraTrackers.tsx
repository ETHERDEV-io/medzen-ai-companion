
import { Gauge, Percent } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface ExtraTrackerProps {
  type: "calories" | "protein";
  value: number;
  target: number;
  onValueChange: (value: number) => void;
  onIncrement: (delta: number) => void;
  onSetTarget: (value: number) => void;
}

export function ExtraTrackerCard({ type, value, target, onValueChange, onSetTarget }: ExtraTrackerProps) {
  const Icon = type === "calories" ? Gauge : Percent;
  const bgColor = type === "calories"
    ? "from-orange-100/80 to-orange-300/30 dark:from-orange-700/40 dark:to-orange-900/60 border-2 border-orange-300/40 dark:border-orange-600/40"
    : "from-green-100/80 to-green-300/30 dark:from-green-700/40 dark:to-green-900/60 border-2 border-green-300/40 dark:border-green-600/40";
  const label = type === "calories" ? "Calorie Tracker" : "Protein Tracker";
  const unit = type === "calories" ? "kcal" : "g";
  const [editingTarget, setEditingTarget] = useState(false);
  const [inputTargetValue, setInputTargetValue] = useState(target);

  const percent = Math.min(100, Math.round((value / target) * 100));

  const handleSetTarget = (e: React.FormEvent) => {
    e.preventDefault();
    onSetTarget(Number(inputTargetValue));
    setEditingTarget(false);
  };

  return (
    <Card className={`bg-gradient-to-tr ${bgColor} shadow-lg`}>
      <CardHeader className="flex-row gap-3 items-center pb-2">
        <Icon className={`w-7 h-7 ${type === "calories" ? "text-orange-700 dark:text-orange-300" : "text-green-700 dark:text-green-300"}`} />
        <CardTitle className={type === "calories" ? "text-orange-800 dark:text-orange-100" : "text-green-800 dark:text-green-100"}>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start space-y-2">
          <div className="text-3xl font-semibold flex items-center gap-1">
            {value}
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
                  {target}
                </button>
              )}
              {" " + unit}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden my-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${type === "calories" ? "bg-orange-400" : "bg-green-400"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="w-full flex items-end">
            <Slider
              value={[value]}
              min={0}
              max={target * 2}
              step={type === "calories" ? 50 : 5}
              onValueChange={newVal => onValueChange(Array.isArray(newVal) ? newVal[0] : newVal)}
              className={`${type === "calories" ? "bg-orange-100 dark:bg-orange-900" : "bg-green-100 dark:bg-green-900"} w-full`}
            />
          </div>
          <div className="text-xs text-muted-foreground">{percent}% of daily goal</div>
        </div>
      </CardContent>
    </Card>
  );
}
