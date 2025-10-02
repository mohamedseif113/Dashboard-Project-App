import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Project Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage your projects with ease</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
