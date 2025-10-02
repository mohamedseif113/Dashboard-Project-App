"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import type { Project, Task } from "@/lib/types"

interface AnalyticsOverviewProps {
  projects: Project[]
  tasks: Task[]
}

export function AnalyticsOverview({ projects, tasks }: AnalyticsOverviewProps) {
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  const completedTasks = tasks.filter((t) => t.status === "Done").length
  const taskCompletionRate = Math.round((completedTasks / tasks.length) * 100)
  const activeProjects = projects.filter((p) => p.status === "In Progress").length
  const onHoldProjects = projects.filter((p) => p.status === "On Hold").length

  const stats = [
    {
      title: "Total Budget",
      value: `$${(totalBudget / 1000).toFixed(0)}k`,
      icon: DollarSign,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Avg Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Task Completion",
      value: `${taskCompletionRate}%`,
      icon: CheckCircle2,
      trend: `${completedTasks}/${tasks.length}`,
      trendUp: true,
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      icon: Clock,
      trend: `${onHoldProjects} on hold`,
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                )}
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
