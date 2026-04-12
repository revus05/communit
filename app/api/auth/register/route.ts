import { prisma } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { hashPassword } from "@/lib/password"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return Response.json({ error: "Все поля обязательны" }, { status: 400 })
    }

    if (password.length < 8) {
      return Response.json({ error: "Пароль должен содержать минимум 8 символов" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: "Пользователь с таким email уже существует" }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role: "STUDENT",
      },
    })

    await createSession({ id: user.id, email: user.email, name: user.name, role: user.role })

    return Response.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch {
    return Response.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
