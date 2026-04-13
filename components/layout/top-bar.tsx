"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Session } from "@/types"
import { ThemeToggle } from "@/components/ui/theme-toggle"

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

  const homeHref = user.role === "ADMIN" ? "/admin/users" : "/training"

  return (
    <header className="h-14 border-b border-border bg-card/10 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <Link href={homeHref} className="flex items-center gap-2">
        <svg viewBox="0 0 500 160" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto text-foreground">
          <g fill="currentColor">
            <rect x="393" y="5" width="100" height="13"></rect>
            <rect x="299" y="28" width="186" height="13"></rect>
            <rect x="0" y="51" width="104" height="13"></rect>
            <rect x="229" y="51" width="207" height="13"></rect>
            <rect x="96" y="74" width="286" height="13"></rect>
            <rect x="150" y="97" width="215" height="13"></rect>
            <rect x="299" y="120" width="35" height="13"></rect>
            <rect x="275" y="143" width="21" height="13"></rect>
          </g>
        </svg>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="w-px h-5 bg-border" />
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
