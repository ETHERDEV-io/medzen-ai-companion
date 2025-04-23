
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Dummy prop type
interface ProgressGraphProps {
  data: Array<{ date: string; progress: number }>;
}

export default function ProgressGraph({ data }: ProgressGraphProps) {
  return (
    <div className="rounded-xl bg-card p-3 shadow mb-4 w-full max-w-3xl mx-auto">
      <div className="text-base font-semibold text-primary mb-2 pl-2">Goal Progress Over Time</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 2" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]} fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="progress" stroke="#9b87f5" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
