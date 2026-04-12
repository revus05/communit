import { prisma } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { verifyPassword } from "@/lib/password"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json({ error: "Email и пароль обязательны" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return Response.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    await createSession({ id: user.id, email: user.email, name: user.name, role: user.role })

    return Response.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch {
    return Response.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
