import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin/users" : "/training")
  }

  return <LoginForm />
}
