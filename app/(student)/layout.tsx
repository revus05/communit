import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { TopBar } from "@/components/layout/top-bar"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const progress = await prisma.stageProgress.findMany({
    where: { userId: session.id },
    select: { stageId: true },
  })

  const completedStageIds = progress.map((p) => p.stageId)

  return (
    <div className="flex flex-col h-screen">
      <TopBar user={session} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar role="STUDENT" completedStageIds={completedStageIds} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
