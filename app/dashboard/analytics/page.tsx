"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { ProjectProgressChart } from "@/components/project-progress-chart"
import { TaskStatusChart } from "@/components/task-status-chart"
import { BudgetOverviewChart } from "@/components/budget-overview-chart"
import { TimelineChart } from "@/components/timeline-chart"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data"

export default function AnalyticsPage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container py-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into your projects and tasks</p>
          </div>

          <div className="space-y-6">
            <AnalyticsOverview projects={MOCK_PROJECTS} tasks={MOCK_TASKS} />

            <div className="grid gap-6 lg:grid-cols-2">
              <ProjectProgressChart projects={MOCK_PROJECTS} />
              <TaskStatusChart tasks={MOCK_TASKS} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <BudgetOverviewChart projects={MOCK_PROJECTS} />
              <TimelineChart projects={MOCK_PROJECTS} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
