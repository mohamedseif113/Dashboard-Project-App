"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ListChecks } from "lucide-react"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"

interface BulkUpdateDialogProps {
  selectedTasks: Task[]
  onBulkUpdate: (updates: Partial<Task>) => void
}

export function BulkUpdateDialog({ selectedTasks, onBulkUpdate }: BulkUpdateDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<TaskStatus | "">("")
  const [priority, setPriority] = useState<TaskPriority | "">("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updates: Partial<Task> = {}
    if (status) updates.status = status as TaskStatus
    if (priority) updates.priority = priority as TaskPriority

    if (Object.keys(updates).length > 0) {
      onBulkUpdate(updates)
      setStatus("")
      setPriority("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={selectedTasks.length === 0}>
          <ListChecks className="mr-2 h-4 w-4" />
          Bulk Update ({selectedTasks.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Bulk Update Tasks</DialogTitle>
            <DialogDescription>
              Update {selectedTasks.length} selected task{selectedTasks.length !== 1 ? "s" : ""} at once.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="bulk-status">
                  <SelectValue placeholder="Select status (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">Todo</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger id="bulk-priority">
                  <SelectValue placeholder="Select priority (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!status && !priority}>
              Update Tasks
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
