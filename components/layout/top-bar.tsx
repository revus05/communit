"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Session } from "@/types"

interface TopBarProps {
  user: Session
}

export function TopBar({ user }: TopBarProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <Link href="/training" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-primary text-xs font-mono font-bold">BT</span>
        </div>
        <span className="text-sm font-semibold tracking-tight hidden sm:block">
          Bank<span className="text-primary">Training</span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary text-xs font-mono font-semibold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.role === "ADMIN" ? "Администратор" : "Студент"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent"
        >
          Выйти
        </button>
      </div>
    </header>
  )
}
