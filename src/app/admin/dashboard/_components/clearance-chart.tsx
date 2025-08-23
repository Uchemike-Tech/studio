'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ClearanceChartProps {
  data: {
    fullyCleared: number;
    inProgress: number;
    actionRequired: number;
    notStarted: number;
  };
}

const chartConfig = {
  count: {
    label: 'Students',
  },
  cleared: {
    label: 'Cleared',
    color: 'hsl(var(--primary))',
  },
  progress: {
    label: 'In Progress',
    color: 'hsl(var(--accent))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--destructive))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies import('@/components/ui/chart').ChartConfig;

export function ClearanceChart({ data }: ClearanceChartProps) {
  const chartData = [
    { status: 'Fully Cleared', count: data.fullyCleared, fill: 'var(--color-cleared)' },
    { status: 'In Progress', count: data.inProgress, fill: 'var(--color-progress)' },
    { status: 'Action Required', count: data.actionRequired, fill: 'var(--color-rejected)' },
    { status: 'Not Started', count: data.notStarted, fill: 'var(--color-pending)' },
  ];

  const noData = chartData.every((item) => item.count === 0);
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      {noData ? (
        <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <XAxis
            dataKey="status"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            allowDecimals={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      )}
    </ChartContainer>
  );
}
