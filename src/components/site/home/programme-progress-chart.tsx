"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = {
  completed: "var(--chart-1)",
  ongoing: "var(--chart-2)",
  pending: "var(--chart-3)",
};

export function ProgrammeProgressChart({
  completed,
  ongoing,
  pending,
  total,
}: {
  completed: number;
  ongoing: number;
  pending: number;
  total: number;
}) {
  const data = [
    { name: "Completed", value: completed, color: COLORS.completed },
    { name: "Ongoing", value: ongoing, color: COLORS.ongoing },
    { name: "Pending", value: pending, color: COLORS.pending },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="65%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={data.filter((d) => d.value > 0).length > 1 ? 2 : 0}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold">{total}</span>
        <span className="text-xs text-muted-foreground">Total Items</span>
      </div>
    </div>
  );
}
