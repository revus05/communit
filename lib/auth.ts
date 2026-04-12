import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { Session } from "@/types"

const COOKIE_NAME = "auth_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET is not set")
  return new TextEncoder().encode(secret)
}

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT({
    sub: session.id,
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, getSecret())

    return {
      id: payload.sub as string,
      email: payload["email"] as string,
      name: payload["name"] as string,
      role: payload["role"] as "STUDENT" | "ADMIN",
    }
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSessionFromToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      id: payload.sub as string,
      email: payload["email"] as string,
      name: payload["name"] as string,
      role: payload["role"] as "STUDENT" | "ADMIN",
    }
  } catch {
    return null
  }
}
