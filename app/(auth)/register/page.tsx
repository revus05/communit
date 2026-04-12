import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"

export default async function RegisterPage() {
  const session = await getSession()
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin/users" : "/training")
  }

  return <RegisterForm />
}
