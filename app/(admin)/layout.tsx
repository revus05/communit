import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TopBar } from "@/components/layout/top-bar"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")
  if (session.role !== "ADMIN") redirect("/training")

  return (
    <div className="flex flex-col h-screen">
      <TopBar user={session} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar role="ADMIN" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
