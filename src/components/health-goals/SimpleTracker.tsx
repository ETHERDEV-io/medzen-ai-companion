
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface SimpleTrackerProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string; // tailwind color e.g. 'indigo'
  onValueChange: (v: number) => void;
  onTargetChange: (v: number) => void;
}

export default function SimpleTracker({
  label, value, target, unit, color, onValueChange, onTargetChange
}: SimpleTrackerProps) {
  const percent = Math.min(100, Math.round((value / (target || 1)) * 100));
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetVal, setTargetVal] = useState(target);

  // For Steps/Calories, big range, others smaller
  const getSliderMax = () => {
    if (unit === "steps") return Math.max(target * 2, 20000);
    if (unit === "kcal") return Math.max(target * 2, 4000);
    if (unit === "cups") return Math.max(target * 2, 32);
    if (unit === "g") return Math.max(target * 2, 300);
    return target * 2;
  };

  return (
    <div className={`bg-white/70 dark:bg-zinc-900/70 rounded-lg px-3 py-2 shadow flex flex-col`}>
      <div className="flex items-baseline gap-2">
        <div className={`text-base sm:text-lg font-semibold text-${color}-800 dark:text-${color}-200`}>{label}</div>
        <div className="ml-auto flex items-baseline gap-2">
          <span className={`text-xl sm:text-2xl font-bold text-${color}-700 dark:text-${color}-200`}>
            {value.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground align-baseline">/</span>
          {editingTarget ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                onTargetChange(Number(targetVal));
                setEditingTarget(false);
              }}
              className="inline-block"
            >
              <Input
                type="number"
                value={targetVal}
                min={1}
                max={getSliderMax()}
                autoFocus
                onChange={e => setTargetVal(Number(e.target.value))}
                className="w-16 inline-block h-7 text-base border border-primary rounded-md"
              />
              <button type="submit" className="ml-1 text-primary font-semibold text-xs">Save</button>
            </form>
          ) : (
            <button
              className={`underline text-${color}-700 dark:text-${color}-300 px-1 bg-transparent text-sm`}
              onClick={() => { setEditingTarget(true); setTargetVal(target); }}
              type="button"
              aria-label="Edit target"
              tabIndex={0}
            >
              {target} {unit}
            </button>
          )}
        </div>
      </div>
      <div className="my-2 px-2">
        <Slider
          value={[value]}
          min={0}
          max={getSliderMax()}
          step={unit === "steps" ? 100 : (unit === "kcal" ? 10 : 1)}
          onValueChange={v => onValueChange(Array.isArray(v) ? v[0] : v)}
          className={`w-full bg-${color}-200 dark:bg-${color}-950`}
        />
      </div>
      <div className="text-xs text-muted-foreground pl-2">{percent}% of daily goal</div>
    </div>
  );
}
