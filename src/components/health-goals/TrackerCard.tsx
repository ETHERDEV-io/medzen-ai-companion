
import { Activity, Droplet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TrackerCardProps {
  type: "steps" | "water";
  value: number;
  target: number;
  onValueChange: (value: number) => void;
  onIncrement: (amount: number) => void;
}

export default function TrackerCard({ type, value, target, onValueChange, onIncrement }: TrackerCardProps) {
  const percent = Math.min(100, Math.round((value / target) * 100));
  
  const isSteps = type === "steps";
  const isWater = type === "water";
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSteps) {
      const raw = Number(e.target.value.replace(/[^0-9]/g, ""));
      onValueChange(Math.max(0, Math.min(target * 2, raw)));
    } else {
      onValueChange(Number(e.target.value));
    }
  };
  
  return (
    <Card className={`bg-gradient-to-tr ${
      isSteps 
        ? "from-blue-100/80 to-blue-400/30 dark:from-blue-700/40 dark:to-blue-900/60 border-2 border-blue-300/40 dark:border-blue-600/40" 
        : "from-teal-100/80 to-teal-300/30 dark:from-teal-700/40 dark:to-teal-900/60 border-2 border-teal-300/40 dark:border-teal-600/40"
    } shadow-lg`}>
      <CardHeader className="flex-row gap-3 items-center pb-2">
        {isSteps ? (
          <Activity className="w-7 h-7 text-blue-700 dark:text-blue-200" />
        ) : (
          <Droplet className="w-7 h-7 text-teal-700 dark:text-teal-200" />
        )}
        <CardTitle className={isSteps ? "text-blue-800 dark:text-blue-100" : "text-teal-800 dark:text-teal-100"}>
          {isSteps ? "Step Tracker" : "Water Tracker"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start space-y-2">
          <span className="text-3xl font-semibold">
            {isSteps ? value.toLocaleString() : value}
            {isSteps && <span className="text-base text-muted-foreground"> / {target}</span>}
          </span>
          {isWater && <span className="text-muted-foreground text-base">cups / {target} cups goal</span>}
          
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden my-1">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isSteps ? "bg-blue-400" : "bg-teal-400"}`} 
              style={{ width: `${percent}%` }} 
            />
          </div>
          
          <div className="flex items-center gap-2 w-full">
            {isSteps ? (
              <>
                <Button size="icon" variant="secondary" onClick={() => onIncrement(-500)} className="rounded-full">-500</Button>
                <Input 
                  className="w-24 text-center border-gray-300 dark:border-gray-700" 
                  type="number" 
                  min={0}
                  max={target * 2}
                  value={value} 
                  onChange={handleChange} 
                />
                <Button size="icon" variant="secondary" onClick={() => onIncrement(500)} className="rounded-full">+500</Button>
              </>
            ) : (
              <>
                <Button size="icon" variant="secondary" onClick={() => onIncrement(-1)} className="rounded-full">-1</Button>
                <Button size="icon" variant="secondary" onClick={() => onIncrement(1)} className="rounded-full">+1</Button>
              </>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">{percent}% of daily goal</div>
        </div>
      </CardContent>
    </Card>
  );
}
