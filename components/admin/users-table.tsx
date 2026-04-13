"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { UserDTO } from "@/types"

interface UsersTableProps {
  users: UserDTO[]
}

type SortField = "name" | "completedStages" | "examScore" | "createdAt" | "onlineHours" | "offlineHours"
type SortDir = "asc" | "desc"

export function UsersTable({ users }: UsersTableProps) {
  const [sort, setSort] = useState<SortField>("completedStages")
  const [dir, setDir] = useState<SortDir>("desc")

  function toggleSort(field: SortField) {
    if (sort === field) {
      setDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSort(field)
      setDir("desc")
    }
  }

  const sorted = [...users].sort((a, b) => {
    let av: string | number | null = a[sort]
    let bv: string | number | null = b[sort]
    if (av === null) av = dir === "asc" ? Infinity : -Infinity
    if (bv === null) bv = dir === "asc" ? Infinity : -Infinity
    if (typeof av === "string" && typeof bv === "string") {
      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
    }
    return dir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number)
  })

  function SortIcon({ field }: { field: SortField }) {
    if (sort !== field) return <span className="text-muted-foreground/40 ml-1">↕</span>
    return <span className="text-primary ml-1">{dir === "asc" ? "↑" : "↓"}</span>
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead
              className="cursor-pointer select-none hover:text-foreground"
              onClick={() => toggleSort("name")}
            >
              Сотрудник <SortIcon field="name" />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-foreground"
              onClick={() => toggleSort("completedStages")}
            >
              Прогресс <SortIcon field="completedStages" />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-foreground"
              onClick={() => toggleSort("examScore")}
            >
              Результат теста <SortIcon field="examScore" />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-foreground"
              onClick={() => toggleSort("onlineHours")}
            >
              Онлайн (ч.) <SortIcon field="onlineHours" />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-foreground"
              onClick={() => toggleSort("offlineHours")}
            >
              Офлайн (ч.) <SortIcon field="offlineHours" />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:text-foreground"
              onClick={() => toggleSort("createdAt")}
            >
              Дата регистрации <SortIcon field="createdAt" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Нет зарегистрированных студентов
              </TableCell>
            </TableRow>
          )}
          {sorted.map((user) => (
            <TableRow key={user.id} className="border-border">
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary text-xs font-mono font-semibold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 min-w-32">
                  <Progress value={(user.completedStages / 10) * 100} className="h-1.5 flex-1" />
                  <span className="text-xs font-mono text-muted-foreground shrink-0">
                    {user.completedStages}/10
                  </span>
                </div>
                {user.completedStages === 10 && (
                  <Badge
                    variant="outline"
                    className="mt-1 text-[10px] border-[var(--color-success)]/40 text-[var(--color-success)]"
                  >
                    Обучение завершено
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {user.examScore !== null ? (
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold",
                      user.examScore >= 80
                        ? "text-[var(--color-success)]"
                        : user.examScore >= 60
                          ? "text-yellow-400"
                          : "text-destructive",
                    )}
                  >
                    {user.examScore}%
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {user.onlineHours > 0 ? (
                  <span className="font-mono text-sm text-sky-400">{user.onlineHours} ч.</span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {user.offlineHours > 0 ? (
                  <span className="font-mono text-sm text-violet-400">{user.offlineHours} ч.</span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
