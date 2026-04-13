import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret")
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    console.log("1")
    console.log(secret)
    console.log(process.env.WEBHOOK_SECRET)
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, score } = body

    if (!email || typeof score !== "number") {
      console.log("2")
      console.log(email)
      console.log(score)
      console.log(body)
      return Response.json({ error: "email и score обязательны" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.log("3")
      console.log(user)
      return Response.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    await prisma.examResult.upsert({
      where: { userId: user.id },
      update: { score, takenAt: new Date() },
      create: { userId: user.id, score },
    })

    console.log("4")
    return Response.json({ ok: true })
  } catch (e) {
    console.log(e)
    return Response.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
