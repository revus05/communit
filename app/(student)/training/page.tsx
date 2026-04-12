import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { StageCard } from "@/components/training/stage-card"
import { ExamLinkBanner } from "@/components/training/exam-link-banner"
import { PageHeader } from "@/components/layout/page-header"
import type { StageProgressDTO } from "@/types"

export default async function TrainingPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const [stages, progressList, examResult] = await Promise.all([
    prisma.stage.findMany({ orderBy: { id: "asc" } }),
    prisma.stageProgress.findMany({ where: { userId: session.id } }),
    prisma.examResult.findUnique({ where: { userId: session.id } }),
  ])

  const progressMap = new Map(progressList.map((p) => [p.stageId, p]))
  const completedIds = progressList.map((p) => p.stageId)
  const allDone = completedIds.length === 10

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Программа обучения"
        description={`Пройдите все 10 этапов последовательно`}
      />

      {allDone && (
        <div className="mb-6">
          <ExamLinkBanner examScore={examResult?.score ?? null} />
        </div>
      )}

      <div className="space-y-2">
        {stages.map((stage) => {
          const isCompleted = completedIds.includes(stage.id)
          const isActive = stage.id === completedIds.length + 1 && !isCompleted
          const isLocked = stage.id > completedIds.length + 1

          const progressEntry = progressMap.get(stage.id)
          const progressDTO: StageProgressDTO | undefined = progressEntry
            ? {
                id: progressEntry.id,
                stageId: progressEntry.stageId,
                hoursSpent: progressEntry.hoursSpent,
                attendedOffline: progressEntry.attendedOffline,
                completedAt: progressEntry.completedAt.toISOString(),
              }
            : undefined

          return (
            <StageCard
              key={stage.id}
              id={stage.id}
              title={stage.title}
              description={stage.description}
              status={isCompleted ? "completed" : isActive ? "active" : "locked"}
              progress={progressDTO}
            />
          )
        })}
      </div>
    </div>
  )
}
