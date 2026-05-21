"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Workflow Operations</h1>
            <p className="text-sm text-muted-foreground">
              Manage workflows and execution operations.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Add user menu, notifications, etc. here */}
          </div>
        </div>
      </div>
    </header>
  )
}
