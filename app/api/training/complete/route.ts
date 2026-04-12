import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: "Не авторизован" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { stageId, hoursSpent, attendedOffline } = body

    if (!stageId || typeof hoursSpent !== "number" || hoursSpent <= 0) {
      return Response.json({ error: "Неверные данные" }, { status: 400 })
    }

    const completedCount = await prisma.stageProgress.count({
      where: { userId: session.id },
    })

    const nextAllowed = completedCount + 1
    if (stageId !== nextAllowed) {
      return Response.json({ error: "Этот этап ещё не доступен" }, { status: 400 })
    }

    const existing = await prisma.stageProgress.findUnique({
      where: { userId_stageId: { userId: session.id, stageId } },
    })
    if (existing) {
      return Response.json({ error: "Этап уже пройден" }, { status: 409 })
    }

    const progress = await prisma.stageProgress.create({
      data: {
        userId: session.id,
        stageId,
        hoursSpent,
        attendedOffline: Boolean(attendedOffline),
      },
    })

    return Response.json({ progress })
  } catch {
    return Response.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
