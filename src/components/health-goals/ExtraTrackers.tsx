
import { Gauge, Percent } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExtraTrackerProps {
  type: "calories" | "protein";
  value: number;
  target: number;
  onValueChange: (value: number) => void;
  onIncrement: (delta: number) => void;
}

export function ExtraTrackerCard({ type, value, target, onValueChange, onIncrement }: ExtraTrackerProps) {
  const Icon = type === "calories" ? Gauge : Percent;
  const color = type === "calories"
    ? "text-orange-500"
    : "text-green-700";
  const label = type === "calories" ? "Calorie Tracker" : "Protein Tracker";
  const unit = type === "calories" ? "kcal" : "g";

  const percentVal = Math.min(100, Math.round((value / target) * 100));

  return (
    <Card className="bg-gradient-to-tr from-orange-50 to-yellow-100 dark:from-orange-900/10 dark:to-yellow-800/10 border-2 border-orange-200/40 dark:border-orange-600/40 shadow-lg">
      <CardHeader className="flex-row gap-3 items-center pb-2">
        <Icon className={`w-7 h-7 ${color}`} />
        <CardTitle className="text-orange-800 dark:text-orange-100">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start space-y-2">
          <span className="text-3xl font-semibold">
            {value}&nbsp;<span className="text-base text-muted-foreground">/ {target} {unit}</span>
          </span>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden my-1">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-orange-400"
              style={{ width: `${percentVal}%` }} 
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <Button size="icon" variant="secondary" onClick={() => onIncrement(-50)} className="rounded-full">-50</Button>
            <Input 
              className="w-24 text-center border-gray-300 dark:border-gray-700"
              type="number"
              min={0}
              max={target * 2}
              value={value}
              onChange={e => onValueChange(Math.max(0, Math.min(target * 2, Number(e.target.value))))}
            />
            <Button size="icon" variant="secondary" onClick={() => onIncrement(50)} className="rounded-full">+50</Button>
          </div>
          <div className="text-xs text-muted-foreground">{percentVal}% of daily goal</div>
        </div>
      </CardContent>
    </Card>
  );
}
