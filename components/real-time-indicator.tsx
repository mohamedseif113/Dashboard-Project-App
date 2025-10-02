"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export function RealTimeIndicator() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useWebSocket((message) => {
    setIsConnected(true)
    setLastUpdate(new Date())
  })

  useEffect(() => {
    // Simulate connection status
    const timer = setTimeout(() => setIsConnected(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Badge variant={isConnected ? "secondary" : "outline"} className="gap-1.5">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span className="text-xs">Live</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span className="text-xs">Connecting...</span>
        </>
      )}
    </Badge>
  )
}
