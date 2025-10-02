"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWebSocket } from "@/hooks/use-websocket"
import type { WebSocketMessage } from "@/lib/websocket"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: string
  message: string
  timestamp: number
  userId: string
  userName: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "project_update",
      message: "Updated project progress to 65%",
      timestamp: Date.now() - 300000,
      userId: "2",
      userName: "Project Manager",
    },
    {
      id: "2",
      type: "task_create",
      message: "Created new task: Implement responsive navigation",
      timestamp: Date.now() - 600000,
      userId: "3",
      userName: "Developer",
    },
    {
      id: "3",
      type: "task_update",
      message: "Marked task as completed: Design homepage mockup",
      timestamp: Date.now() - 900000,
      userId: "3",
      userName: "Developer",
    },
  ])

  useWebSocket((message: WebSocketMessage) => {
    // Add new activity from WebSocket message
    if (message.type !== "user_activity") {
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type: message.type,
        message: getActivityMessage(message),
        timestamp: message.timestamp,
        userId: message.userId,
        userName: "Team Member",
      }
      setActivities((prev) => [newActivity, ...prev].slice(0, 20)) // Keep last 20 activities
    }
  })

  const getActivityMessage = (message: WebSocketMessage): string => {
    switch (message.type) {
      case "project_update":
        return `Updated project: ${message.payload.name || "Unknown"}`
      case "task_create":
        return `Created task: ${message.payload.title || "New task"}`
      case "task_update":
        return `Updated task: ${message.payload.title || "Unknown"}`
      case "task_delete":
        return `Deleted a task`
      default:
        return "Activity occurred"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Real-time updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                  <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span>{" "}
                    <span className="text-muted-foreground">{activity.message}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
