import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: "Не авторизован" }, { status: 401 })
  }

  const [stages, progress] = await Promise.all([
    prisma.stage.findMany({ orderBy: { id: "asc" } }),
    prisma.stageProgress.findMany({ where: { userId: session.id } }),
  ])

  return Response.json({
    stages,
    progress,
  })
}
