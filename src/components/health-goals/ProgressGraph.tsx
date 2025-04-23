
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ProgressGraphProps {
  data: Array<{ date: string; progress: number }>;
}

export default function ProgressGraph({ data }: ProgressGraphProps) {
  return (
    <div className="rounded-xl bg-white p-3 shadow mb-4 w-full max-w-3xl mx-auto dark:bg-card">
      <div className="text-base font-semibold text-primary mb-2 pl-2">Goal Progress Over Time</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 2" stroke="var(--border)" />
          <XAxis dataKey="date" fontSize={12} tick={{ fill: "var(--foreground)" }} />
          <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]} fontSize={12} tick={{ fill: "var(--foreground)" }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--card)", 
              borderColor: "var(--border)",
              color: "var(--foreground)"
            }}
          />
          <Line type="monotone" dataKey="progress" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
