"use client"

import { FormEvent, useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"

const ADMIN_UNLOCK_KEY = "admin_unlocked"
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? ""

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const unlocked = sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "true"
    setIsUnlocked(unlocked)
    setIsReady(true)
  }, [])

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!ADMIN_PASSWORD) {
      setError("Password is not configured. Set NEXT_PUBLIC_ADMIN_PASSWORD.")
      return
    }

    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password.")
      return
    }

    sessionStorage.setItem(ADMIN_UNLOCK_KEY, "true")
    setIsUnlocked(true)
    setError("")
    setPassword("")
  }

  if (!isReady) {
    return null
  }

  if (!isUnlocked) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Admin Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the password to continue.
          </p>
          <form onSubmit={handleUnlock} className="mt-4 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
