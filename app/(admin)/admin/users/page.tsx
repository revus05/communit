import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { UsersTable } from "@/components/admin/users-table"
import { PageHeader } from "@/components/layout/page-header"
import type { UserDTO } from "@/types"

export default async function AdminUsersPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/login")

  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: {
      progress: { select: { stageId: true } },
      examResult: { select: { score: true } },
    },
  })

  const userDTOs: UserDTO[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    completedStages: u.progress.length,
    examScore: u.examResult?.score ?? null,
  }))

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Сотрудники"
        description={`${userDTOs.length} зарегистрированных студентов`}
      />
      <UsersTable users={userDTOs} />
    </div>
  )
}
