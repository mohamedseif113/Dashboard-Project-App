"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Project } from "@/lib/types"
import { format, eachMonthOfInterval, startOfMonth } from "date-fns"

interface TimelineChartProps {
  projects: Project[]
}

export function TimelineChart({ projects }: TimelineChartProps) {
  // Get date range
  const allDates = projects.flatMap((p) => [new Date(p.startDate), new Date(p.endDate)])
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

  // Generate monthly data points
  const months = eachMonthOfInterval({ start: minDate, end: maxDate })

  const chartData = months.map((month) => {
    const monthStart = startOfMonth(month)
    const activeProjects = projects.filter((p) => {
      const start = new Date(p.startDate)
      const end = new Date(p.endDate)
      return start <= monthStart && end >= monthStart
    })

    return {
      month: format(month, "MMM yy"),
      active: activeProjects.length,
      avgProgress:
        activeProjects.length > 0
          ? Math.round(activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length)
          : 0,
    }
  })

  const chartConfig = {
    active: {
      label: "Active Projects",
      color: "hsl(var(--chart-1))",
    },
    avgProgress: {
      label: "Avg Progress",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>Active projects and average progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="active" stroke="var(--color-active)" strokeWidth={2} dot={{ r: 4 }} />
            <Line
              type="monotone"
              dataKey="avgProgress"
              stroke="var(--color-avgProgress)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
