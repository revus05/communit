"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle2, Lock, ChevronRight, Users, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

interface StudentSidebarProps {
  role: "STUDENT"
  completedStageIds: number[]
}

interface AdminSidebarProps {
  role: "ADMIN"
}

type AppSidebarProps = StudentSidebarProps | AdminSidebarProps

const STAGE_TITLES = [
  "Введение в банковское дело",
  "Регуляторная база",
  "Продуктовая линейка",
  "Работа с клиентами",
  "Операционные процессы",
  "Управление рисками",
  "Противодействие мошенничеству",
  "Цифровые каналы",
  "Корпоративная культура",
  "Итоговое закрепление",
]

export function AppSidebar(props: AppSidebarProps) {
  const pathname = usePathname()

  if (props.role === "ADMIN") {
    return (
      <aside className="w-56 shrink-0 border-r border-border bg-card/10 flex flex-col">
        <div className="p-4 border-b border-border">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Панель</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <Link
            href="/admin/dashboard"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === "/admin/dashboard"
                ? "bg-accent text-foreground border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <LayoutDashboard size={15} />
            <span>Дашборд</span>
          </Link>
          <Link
            href="/admin/users"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === "/admin/users"
                ? "bg-accent text-foreground border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <Users size={15} />
            <span>Сотрудники</span>
          </Link>
        </nav>
      </aside>
    )
  }

  const { completedStageIds } = props
  const maxUnlocked = completedStageIds.length + 1

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card/10 flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Программа обучения</p>
        <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(completedStageIds.length / 10) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {completedStageIds.length}/10 этапов
        </p>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        {STAGE_TITLES.map((title, i) => {
          const stageId = i + 1
          const isCompleted = completedStageIds.includes(stageId)
          const isActive = stageId === maxUnlocked && !isCompleted
          const isLocked = stageId > maxUnlocked
          const isCurrentPage = pathname === `/training/${stageId}`

          return (
            <Link
              key={stageId}
              href={isLocked ? "#" : `/training/${stageId}`}
              onClick={(e) => isLocked && e.preventDefault()}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors mb-0.5",
                isCurrentPage
                  ? "bg-accent text-foreground border-l-2 border-primary"
                  : isLocked
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              <span className={cn("shrink-0", isCompleted && "text-[var(--color-success)]", isActive && "text-primary")}>
                {isCompleted ? (
                  <CheckCircle2 size={14} />
                ) : isLocked ? (
                  <Lock size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
              <span className="font-mono text-xs text-muted-foreground/60 shrink-0 w-4">{stageId}</span>
              <span className="truncate text-xs">{title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
