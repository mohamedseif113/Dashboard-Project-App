"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowUpDown, Edit2, Eye, Save, X } from "lucide-react"
import type { Project, ProjectStatus } from "@/lib/types"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ProjectsTableProps {
  projects: Project[]
  onSort: (field: keyof Project) => void
  sortField: keyof Project
  sortDirection: "asc" | "desc"
  onUpdateProject: (id: string, updates: Partial<Project>) => void
}

export function ProjectsTable({ projects, onSort, sortField, sortDirection, onUpdateProject }: ProjectsTableProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Project>>({})

  const getStatusColor = (status: ProjectStatus) => {
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

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setEditValues({
      name: project.name,
      budget: project.budget,
      progress: project.progress,
    })
  }

  const handleSave = (id: string) => {
    onUpdateProject(id, editValues)
    setEditingId(null)
    setEditValues({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const SortButton = ({ field, children }: { field: keyof Project; children: React.ReactNode }) => (
    <Button variant="ghost" onClick={() => onSort(field)} className="h-8 px-2 lg:px-3">
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="name">Name</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="startDate">Start Date</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="endDate">End Date</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="progress">Progress</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="budget">Budget</SortButton>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => {
              const isEditing = editingId === project.id
              return (
                <TableRow key={project.id} className="group">
                  <TableCell className="font-medium">
                    {isEditing ? (
                      <Input
                        value={editValues.name || ""}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        className="h-8"
                      />
                    ) : (
                      project.name
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-medium", getStatusColor(project.status))}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editValues.progress || 0}
                          onChange={(e) => setEditValues({ ...editValues, progress: Number(e.target.value) })}
                          className="h-8 w-20"
                        />
                      ) : (
                        <>
                          <Progress value={project.progress} className="w-16" />
                          <span className="text-sm text-muted-foreground">{project.progress}%</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.budget || 0}
                        onChange={(e) => setEditValues({ ...editValues, budget: Number(e.target.value) })}
                        className="h-8 w-32"
                      />
                    ) : (
                      `$${project.budget.toLocaleString()}`
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleSave(project.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(project)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
