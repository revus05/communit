import { getSession } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { StageCompletionForm } from "@/components/training/stage-completion-form"
import { PageHeader } from "@/components/layout/page-header"
import { CheckCircle2, Download, FileText } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Props {
  params: Promise<{ stageId: string }>
}

export default async function StagePage({ params }: Props) {
  const { stageId: stageIdStr } = await params
  const session = await getSession()
  if (!session) redirect("/login")

  const stageId = Number(stageIdStr)
  console.log(stageId)

  if (isNaN(stageId) || stageId < 1 || stageId > 10) notFound()

  const [stage, progressList] = await Promise.all([
    prisma.stage.findUnique({ where: { id: stageId } }),
    prisma.stageProgress.findMany({ where: { userId: session.id } }),
  ])

  if (!stage) notFound()

  const completedIds = progressList.map((p) => p.stageId)
  const maxUnlocked = completedIds.length + 1

  if (stageId > maxUnlocked) redirect("/training")

  const isCompleted = completedIds.includes(stageId)
  const completionRecord = progressList.find((p) => p.stageId === stageId)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Link href="/training" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Назад к программе
        </Link>
      </div>

      <PageHeader title={stage.title}>
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border",
            isCompleted
              ? "text-[var(--color-success)] border-[var(--color-success)]/30 bg-[var(--color-success)]/10"
              : "text-primary border-primary/30 bg-primary/10",
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={12} />
              Пройден
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Активен
            </>
          )}
        </div>
      </PageHeader>

      <div className="space-y-4">
        {/* Stage number badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span className="px-2 py-0.5 rounded bg-muted border border-border">ЭТАП {String(stageId).padStart(2, "0")}</span>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium">
            <FileText size={15} className="text-muted-foreground" />
            Описание
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{stage.description}</p>
        </div>

        {/* File download */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FileText size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{stage.fileName}</p>
                <p className="text-xs text-muted-foreground">Учебный материал</p>
              </div>
            </div>
            <a
              href={stage.fileUrl}
              download={stage.fileName}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded border border-primary/30 hover:bg-primary/5"
            >
              <Download size={12} />
              Скачать
            </a>
          </div>
        </div>

        {/* Completion section */}
        {isCompleted ? (
          <div className="rounded-lg border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 p-5">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[var(--color-success)]">
              <CheckCircle2 size={15} />
              Этап пройден
            </div>
            {completionRecord && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Затрачено времени: <span className="font-mono text-foreground">{completionRecord.hoursSpent} ч.</span></p>
                <p>Формат: <span className="text-foreground">{completionRecord.attendedOffline ? "Офлайн (в офисе)" : "Онлайн"}</span></p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium mb-4">Отметить этап как пройденный</h3>
            <StageCompletionForm stageId={stageId} />
          </div>
        )}
      </div>
    </div>
  )
}
