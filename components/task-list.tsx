"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Save, Trash2, X } from "lucide-react"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskListProps {
  tasks: Task[]
  selectedTasks: string[]
  onToggleTask: (taskId: string) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({ tasks, selectedTasks, onToggleTask, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Task>>({})

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "Low":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "High":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "Critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return ""
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Todo":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      case "In Progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "Review":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "Done":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      default:
        return ""
    }
  }

  const handleEdit = (task: Task) => {
    setEditingId(task.id)
    setEditValues({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    })
  }

  const handleSave = (id: string) => {
    onUpdateTask(id, editValues)
    setEditingId(null)
    setEditValues({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No tasks yet. Add your first task to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isEditing = editingId === task.id
        const isSelected = selectedTasks.includes(task.id)

        return (
          <div
            key={task.id}
            className={cn(
              "rounded-lg border bg-card p-4 transition-colors",
              isSelected && "border-primary bg-primary/5",
            )}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleTask(task.id)}
                className="mt-1"
                aria-label={`Select task ${task.title}`}
              />
              <div className="flex-1 space-y-3">
                {isEditing ? (
                  <>
                    <Input
                      value={editValues.title || ""}
                      onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                      placeholder="Task title"
                    />
                    <Textarea
                      value={editValues.description || ""}
                      onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                      placeholder="Task description"
                      rows={2}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Select
                        value={editValues.status}
                        onValueChange={(value) => setEditValues({ ...editValues, status: value as TaskStatus })}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todo">Todo</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={editValues.priority}
                        onValueChange={(value) => setEditValues({ ...editValues, priority: value as TaskPriority })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="date"
                        value={editValues.dueDate || ""}
                        onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })}
                        className="w-40"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium leading-none">{task.title}</h4>
                      {task.description && <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className={cn("text-xs", getStatusColor(task.status))}>
                        {task.status}
                      </Badge>
                      <Badge variant="secondary" className={cn("text-xs", getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-1">
                {isEditing ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => handleSave(task.id)}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(task)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
