"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface CategoryChartProps {
  data: Array<{ category: string; amount: number }>
}

export function CategoryChart({ data }: CategoryChartProps) {
  const categoryData = data.reduce((acc, item) => {
    const existingCategory = acc.find((c) => c.name === item.category)
    if (existingCategory) {
      existingCategory.value += item.amount
    } else {
      acc.push({ name: item.category, value: item.amount })
    }
    return acc
  }, [] as Array<{ name: string; value: number }>)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

