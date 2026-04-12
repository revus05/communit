import Link from "next/link"
import { CheckCircle2, Lock, ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StageProgressDTO } from "@/types"

type StageStatus = "locked" | "active" | "completed"

interface StageCardProps {
  id: number
  title: string
  description: string
  status: StageStatus
  progress?: StageProgressDTO
}

export function StageCard({ id, title, description, status, progress }: StageCardProps) {
  const isLocked = status === "locked"
  const isCompleted = status === "completed"
  const isActive = status === "active"

  const content = (
    <div
      className={cn(
        "relative rounded-lg border p-4 transition-all duration-200",
        isCompleted && "border-[var(--color-success)]/30 bg-[var(--color-success)]/5",
        isActive &&
          "border-primary/40 bg-primary/5 shadow-[0_0_20px_oklch(0.62_0.20_245/8%)] hover:shadow-[0_0_24px_oklch(0.62_0.20_245/15%)] hover:border-primary/60",
        isLocked && "border-border/30 bg-card/50 opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 w-8 h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold",
            isCompleted && "bg-[var(--color-success)]/15 text-[var(--color-success)]",
            isActive && "bg-primary/15 text-primary",
            isLocked && "bg-muted text-muted-foreground",
          )}
        >
          {String(id).padStart(2, "0")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold truncate">{title}</h3>
            <span className="shrink-0 ml-auto">
              {isCompleted && <CheckCircle2 size={15} className="text-[var(--color-success)]" />}
              {isLocked && <Lock size={13} className="text-muted-foreground" />}
              {isActive && <ChevronRight size={15} className="text-primary" />}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          {isCompleted && progress && (
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {progress.hoursSpent} ч.
              </span>
              {progress.attendedOffline && (
                <span className="text-[var(--color-success)]/80">● офлайн</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isLocked) return content

  return (
    <Link href={`/training/${id}`} className="block">
      {content}
    </Link>
  )
}
