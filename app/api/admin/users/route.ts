import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: {
      progress: { select: { stageId: true, hoursSpent: true, attendedOffline: true } },
      examResult: { select: { score: true } },
    },
  })

  const result = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt.toISOString(),
    completedStages: u.progress.length,
    examScore: u.examResult?.score ?? null,
    onlineHours: u.progress
      .filter((p) => !p.attendedOffline)
      .reduce((sum, p) => sum + p.hoursSpent, 0),
    offlineHours: u.progress
      .filter((p) => p.attendedOffline)
      .reduce((sum, p) => sum + p.hoursSpent, 0),
  }))

  return Response.json({ users: result })
}
