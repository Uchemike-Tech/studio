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

const chartData = [
  { status: 'Fully Cleared', count: 89, fill: 'var(--color-cleared)' },
  { status: 'In Progress', count: 156, fill: 'var(--color-progress)' },
  { status: 'Action Required', count: 45, fill: 'var(--color-rejected)' },
  { status: 'Not Started', count: 162, fill: 'var(--color-pending)' },
];

const chartConfig = {
  count: {
    label: 'Students',
  },
  cleared: {
    label: 'Cleared',
    color: 'hsl(var(--accent))',
  },
  progress: {
    label: 'In Progress',
    color: 'hsl(var(--primary))',
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

export function ClearanceChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
