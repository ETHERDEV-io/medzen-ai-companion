
import React, { useState } from "react";
import { PersonStanding, Heart, Bed, Droplet, Dumbbell, Flame, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const icons = {
  walk: PersonStanding,
  heart: Heart,
  sleep: Bed,
  water: Droplet,
  gym: Dumbbell,
  calories: Flame,
  dumbbell: Dumbbell,
};

const colors = {
  walk: "from-orange-400 to-yellow-300",
  heart: "from-yellow-400 to-orange-300",
  sleep: "from-cyan-400 to-blue-300",
  water: "from-green-300 to-emerald-500",
  gym: "from-purple-400 to-pink-400",
  calories: "from-rose-400 to-orange-400",
  dumbbell: "from-indigo-400 to-blue-500",
};

type GoalKey = "walk" | "heart" | "sleep" | "water" | "gym" | "calories" | "dumbbell";

interface HealthGoalCardProps {
  label: string;
  value: string;
  unit: string;
  icon: GoalKey;
  color?: string;
  onValueChange?: (v: string) => void;
  onEdit?: () => void;
}

export default function HealthGoalCard({
  label,
  value,
  unit,
  icon,
  color,
  onValueChange,
  onEdit
}: HealthGoalCardProps) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(value);
  const Icon = icons[icon];
  const gradient = color || colors[icon];

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setEditing(false);
    if (onValueChange) onValueChange(editVal);
  }

  return (
    <Card
      className={`
        glass-morphism group
        overflow-hidden min-h-[130px] flex flex-col justify-between
        items-start w-full
        bg-gradient-to-br ${gradient} bg-opacity-50 relative
        transition-all duration-300
        border-none shadow-lg
        backdrop-blur-3xl
        rounded-xl
        px-4 py-4
        md:min-h-[140px]
        hover:ring-2 hover:ring-white/30
        `}
      style={{
        background: 'rgba(32,34,41,0.70)',
        border: '1.5px solid rgba(255,255,255,0.07)'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-7 h-7 flex-shrink-0 drop-shadow text-white" />
        <div className="text-xs tracking-wide font-medium text-white/90">{label}</div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="ml-auto p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Edit goal"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-semibold flex items-end gap-2 min-h-[32px]">
        {editing ? (
          <form onSubmit={handleSave} className="flex items-end gap-1">
            <Input
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              className="w-16 text-lg font-bold bg-black/40 border-white/20 text-white px-2 py-1 h-8"
              autoFocus
              type="number"
              min="0"
              max="20000"
            />
            <button className="text-xs text-indigo-200 font-semibold ml-1 mb-1" type="submit">Save</button>
          </form>
        ) : (
          <>
            <span className="text-white">{value}</span>
            <span className="text-base text-white/70 font-normal ml-1">{unit}</span>
            {onValueChange && (
              <button
                type="button"
                title="Edit"
                className="ml-2 opacity-70 group-hover:opacity-100 text-xs bg-transparent underline mb-1 text-white/80"
                onClick={() => setEditing(true)}
                tabIndex={0}
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
