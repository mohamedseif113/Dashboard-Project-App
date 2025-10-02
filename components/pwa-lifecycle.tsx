"use client"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/pwa"

export function PWALifecycle() {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return null
}
