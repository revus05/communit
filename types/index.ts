export interface Session {
  id: string
  email: string
  name: string
  role: "STUDENT" | "ADMIN"
}

export interface JWTPayload {
  sub: string
  email: string
  name: string
  role: "STUDENT" | "ADMIN"
  iat: number
  exp: number
}

export interface UserDTO {
  id: string
  name: string
  email: string
  role: "STUDENT" | "ADMIN"
  createdAt: string
  completedStages: number
  examScore: number | null
}

export interface StageDTO {
  id: number
  title: string
  description: string
  fileUrl: string
  fileName: string
}

export interface StageProgressDTO {
  id: string
  stageId: number
  hoursSpent: number
  attendedOffline: boolean
  completedAt: string
}
