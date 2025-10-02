export type UserRole = "Admin" | "ProjectManager" | "Developer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface AuthToken {
  token: string
  user: User
  expiresAt: number
}

export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled"
export type TaskPriority = "Low" | "Medium" | "High" | "Critical"
export type TaskStatus = "Todo" | "In Progress" | "Review" | "Done"

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  startDate: string
  endDate: string
  progress: number
  budget: number
  description?: string
  managerId: string
  teamMembers: string[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}
