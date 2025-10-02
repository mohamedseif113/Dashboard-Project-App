import type { User, AuthToken, UserRole } from "./types"

const JWT_SECRET = "your-secret-key-change-in-production"
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

// Mock user database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "Admin",
    avatar: "/admin-interface.png",
  },
  {
    id: "2",
    email: "manager@example.com",
    password: "manager123",
    name: "Project Manager",
    role: "ProjectManager",
    avatar: "/diverse-team-manager.png",
  },
  {
    id: "3",
    email: "dev@example.com",
    password: "dev123",
    name: "Developer",
    role: "Developer",
    avatar: "/developer-working.png",
  },
]

// Simple JWT encoding (for demo purposes - use proper JWT library in production)
function encodeJWT(payload: any): string {
  return btoa(JSON.stringify(payload))
}

function decodeJWT(token: string): any {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

export async function login(email: string, password: string): Promise<AuthToken | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user
  const expiresAt = Date.now() + TOKEN_EXPIRY

  const token = encodeJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt,
  })

  return {
    token,
    user: userWithoutPassword,
    expiresAt,
  }
}

export function verifyToken(token: string): { userId: string; email: string; role: UserRole } | null {
  const payload = decodeJWT(token)

  if (!payload || payload.expiresAt < Date.now()) {
    return null
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  }
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    Admin: 3,
    ProjectManager: 2,
    Developer: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function getStoredAuth(): AuthToken | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("auth")
  if (!stored) return null

  try {
    const auth: AuthToken = JSON.parse(stored)
    if (auth.expiresAt < Date.now()) {
      localStorage.removeItem("auth")
      return null
    }
    return auth
  } catch {
    return null
  }
}

export function storeAuth(auth: AuthToken): void {
  if (typeof window === "undefined") return
  localStorage.setItem("auth", JSON.stringify(auth))
}

export function clearAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth")
}
