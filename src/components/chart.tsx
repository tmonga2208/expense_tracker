// src/components/chart.tsx
"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart"
import { Card, CardContent } from "../components/ui/card"

const chartConfig = {
  desktop: {
    label: "Spendings",
    color: "#2563eb",
  },
} satisfies ChartConfig

interface ChartComponentProps {
  data: { month: string; amount: number }[];
}

export function ChartComponent({ data }: ChartComponentProps) {
  if (data.length < 3) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[200px]">
        <CardContent className="text-center">
          <p className="text-xl font-semibold text-gray-700">Not Enough Data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="amount" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}