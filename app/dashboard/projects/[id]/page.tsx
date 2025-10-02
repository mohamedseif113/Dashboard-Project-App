"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { BulkUpdateDialog } from "@/components/bulk-update-dialog"
import { TaskList } from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, DollarSign, Users } from "lucide-react"
import { MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data"
import type { Task, TaskStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useWebSocket } from "@/hooks/use-websocket"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS.filter((t) => t.projectId === projectId))
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All")

  const project = MOCK_PROJECTS.find((p) => p.id === projectId)

  const { sendMessage } = useWebSocket((message) => {
    if (message.payload.projectId !== projectId) return

    switch (message.type) {
      case "task_create":
        setTasks((prev) => [...prev, message.payload.task])
        break
      case "task_update":
        setTasks((prev) =>
          prev.map((t) => (t.id === message.payload.taskId ? { ...t, ...message.payload.updates } : t)),
        )
        break
      case "task_delete":
        setTasks((prev) => prev.filter((t) => t.id !== message.payload.taskId))
        break
    }
  })

  const filteredTasks = useMemo(() => {
    if (statusFilter === "All") return tasks
    return tasks.filter((task) => task.status === statusFilter)
  }, [tasks, statusFilter])

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "Todo").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      review: tasks.filter((t) => t.status === "Review").length,
      done: tasks.filter((t) => t.status === "Done").length,
    }
  }, [tasks])

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Project not found</h2>
            <Button className="mt-4" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const handleAddTask = (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, task])

    sendMessage({
      type: "task_create",
      payload: { projectId, task },
    })
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )

    sendMessage({
      type: "task_update",
      payload: { projectId, taskId, updates },
    })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    setSelectedTasks((prev) => prev.filter((id) => id !== taskId))

    sendMessage({
      type: "task_delete",
      payload: { projectId, taskId },
    })
  }

  const handleToggleTask = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleBulkUpdate = (updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        selectedTasks.includes(task.id)
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )

    selectedTasks.forEach((taskId) => {
      sendMessage({
        type: "task_update",
        payload: { projectId, taskId, updates },
      })
    })

    setSelectedTasks([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "In Progress":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "On Hold":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "Completed":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "Cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return ""
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container py-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                {project.description && <p className="mt-2 text-muted-foreground">{project.description}</p>}
              </div>
              <Badge variant="secondary" className={cn("text-sm", getStatusColor(project.status))}>
                {project.status}
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{project.progress}%</div>
                    <Progress value={project.progress} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${project.budget.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Timeline</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>{new Date(project.startDate).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">to {new Date(project.endDate).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.teamMembers.length}</div>
                  <p className="text-xs text-muted-foreground">members</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Manage tasks for this project ({taskStats.total} total, {taskStats.done} completed)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <BulkUpdateDialog
                    selectedTasks={tasks.filter((t) => selectedTasks.includes(t.id))}
                    onBulkUpdate={handleBulkUpdate}
                  />
                  <AddTaskDialog projectId={projectId} onAddTask={handleAddTask} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "All")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="All">All ({taskStats.total})</TabsTrigger>
                  <TabsTrigger value="Todo">Todo ({taskStats.todo})</TabsTrigger>
                  <TabsTrigger value="In Progress">In Progress ({taskStats.inProgress})</TabsTrigger>
                  <TabsTrigger value="Review">Review ({taskStats.review})</TabsTrigger>
                  <TabsTrigger value="Done">Done ({taskStats.done})</TabsTrigger>
                </TabsList>
                <TabsContent value={statusFilter} className="mt-0">
                  <TaskList
                    tasks={filteredTasks}
                    selectedTasks={selectedTasks}
                    onToggleTask={handleToggleTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
