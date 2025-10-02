"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/lib/types"
import { login as authLogin, getStoredAuth, storeAuth, clearAuth } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getStoredAuth()
    if (auth) {
      setUser(auth.user)
      setToken(auth.token)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const auth = await authLogin(email, password)
    if (auth) {
      setUser(auth.user)
      setToken(auth.token)
      storeAuth(auth)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    clearAuth()
  }, [])

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
