"use client"

import { useEffect, useCallback } from "react"
import { wsManager, type WebSocketMessage } from "@/lib/websocket"
import { useAuth } from "./use-auth"

export function useWebSocket(onMessage?: (message: WebSocketMessage) => void) {
  const { token, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !token) return

    wsManager.connect(token)

    return () => {
      // Don't disconnect on unmount as other components might be using it
    }
  }, [isAuthenticated, token])

  useEffect(() => {
    if (!onMessage) return

    const unsubscribe = wsManager.subscribe(onMessage)
    return unsubscribe
  }, [onMessage])

  const sendMessage = useCallback((message: Omit<WebSocketMessage, "timestamp" | "userId">) => {
    const { user } = useAuth.getState?.() || {}
    if (!user) return

    wsManager.send({
      ...message,
      timestamp: Date.now(),
      userId: user.id,
    })
  }, [])

  return { sendMessage }
}

// Helper hook to get the auth state outside of React components
useWebSocket.getState = () => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("auth")
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}
