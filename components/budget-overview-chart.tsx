"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Project } from "@/lib/types"

interface BudgetOverviewChartProps {
  projects: Project[]
}

export function BudgetOverviewChart({ projects }: BudgetOverviewChartProps) {
  const sortedProjects = [...projects].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  const chartData = sortedProjects.map((project) => ({
    name: project.name.length > 12 ? project.name.substring(0, 12) + "..." : project.name,
    budget: project.budget,
    spent: Math.round(project.budget * (project.progress / 100)),
  }))

  const chartConfig = {
    budget: {
      label: "Total Budget",
      color: "hsl(var(--chart-1))",
    },
    spent: {
      label: "Spent",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Budget allocation and spending across projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
            <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="budget"
              stackId="1"
              stroke="var(--color-budget)"
              fill="var(--color-budget)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="spent"
              stackId="2"
              stroke="var(--color-spent)"
              fill="var(--color-spent)"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
