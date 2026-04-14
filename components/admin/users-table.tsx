"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { UserDTO } from "@/types";

interface UsersTableProps {
  users: UserDTO[];
}

type SortField =
  | "name"
  | "completedStages"
  | "examScore"
  | "createdAt"
  | "onlineHours"
  | "offlineHours";
type SortDir = "asc" | "desc";
type ViewMode = "list" | "cards";

const SORT_LABELS: Record<SortField, string> = {
  completedStages: "Прогресс",
  examScore: "Балл",
  name: "Имя",
  onlineHours: "Онлайн",
  offlineHours: "Офлайн",
  createdAt: "Дата",
};

export function UsersTable({ users }: UsersTableProps) {
  const [sort, setSort] = useState<SortField>("completedStages");
  const [dir, setDir] = useState<SortDir>("desc");
  const [view, setView] = useState<ViewMode>("list");

  function toggleSort(field: SortField) {
    if (sort === field) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setDir("desc");
    }
  }

  const sorted = [...users].sort((a, b) => {
    let av: string | number | null = a[sort];
    let bv: string | number | null = b[sort];
    if (av === null) av = dir === "asc" ? Infinity : -Infinity;
    if (bv === null) bv = dir === "asc" ? Infinity : -Infinity;
    if (typeof av === "string" && typeof bv === "string") {
      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return dir === "asc"
      ? (av as number) - (bv as number)
      : (bv as number) - (av as number);
  });

  function SortIcon({ field }: { field: SortField }) {
    if (sort !== field)
      return (
        <ArrowUpDown
          size={13}
          className="text-muted-foreground/40 ml-1 inline-block"
        />
      );
    return dir === "asc" ? (
      <ArrowUp size={13} className="text-primary ml-1 inline-block" />
    ) : (
      <ArrowDown size={13} className="text-primary ml-1 inline-block" />
    );
  }

  const ExamBadge = ({ score }: { score: number | null }) => {
    if (score === null)
      return <span className="text-xs text-muted-foreground">—</span>;
    return (
      <span
        className={cn(
          "font-mono text-sm font-semibold",
          score >= 80
            ? "text-[var(--color-success)]"
            : score >= 60
              ? "text-yellow-400"
              : "text-destructive",
        )}
      >
        {score}%
      </span>
    );
  };

  // ── Toolbar ────────────────────────────────────────────────────────
  const Toolbar = () => (
    <div className="flex items-center justify-between mb-3">
      {/* Sort pills — visible in card view */}
      {view === "cards" && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Сорт.:</span>
          {(Object.keys(SORT_LABELS) as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors",
                sort === field
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent",
              )}
            >
              {SORT_LABELS[field]}
              {sort === field &&
                (dir === "asc" ? (
                  <ArrowUp size={10} />
                ) : (
                  <ArrowDown size={10} />
                ))}
            </button>
          ))}
        </div>
      )}
      {view === "list" && <div />}

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 ml-auto">
        <button
          onClick={() => setView("list")}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            view === "list"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          title="Список"
        >
          <LayoutList size={15} />
        </button>
        <button
          onClick={() => setView("cards")}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            view === "cards"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          title="Карточки"
        >
          <LayoutGrid size={15} />
        </button>
      </div>
    </div>
  );

  // ── List view ──────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div>
        <Toolbar />
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
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
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
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-32">
                      <Progress
                        value={(user.completedStages / 10) * 100}
                        className="h-1.5 flex-1"
                      />
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
                    <ExamBadge score={user.examScore} />
                  </TableCell>
                  <TableCell>
                    {user.onlineHours > 0 ? (
                      <span className="font-mono text-sm text-sky-400">
                        {user.onlineHours} ч.
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.offlineHours > 0 ? (
                      <span className="font-mono text-sm text-violet-400">
                        {user.offlineHours} ч.
                      </span>
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
      </div>
    );
  }

  // ── Card view ──────────────────────────────────────────────────────
  return (
    <div>
      <Toolbar />

      {sorted.length === 0 && (
        <div className="text-center text-muted-foreground py-12 rounded-lg border border-border">
          Нет зарегистрированных студентов
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((user) => {
          const progressPct = (user.completedStages / 10) * 100;
          const isDone = user.completedStages === 10;
          const currentStage = isDone ? null : user.completedStages + 1;

          return (
            <Card key={user.id} className="gap-0 py-0 overflow-hidden">
              {/* Card header strip */}
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-mono font-bold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>

                {/* Status badge */}
                {isDone ? (
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] border-[var(--color-success)]/40 text-[var(--color-success)]"
                  >
                    Завершено
                  </Badge>
                ) : (
                  <span className="shrink-0 text-[10px] font-mono text-muted-foreground bg-muted/50 border border-border rounded px-1.5 py-0.5">
                    Этап {currentStage}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Progress value={progressPct} className="h-1.5 flex-1" />
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {user.completedStages}/10
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 h-0.5 rounded-full",
                        i < user.completedStages ? "bg-primary" : "bg-border",
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Stats footer */}
              <div className="border-t border-border/60 bg-muted/20 px-4 py-2.5 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground leading-none mb-1">
                    Тест
                  </p>
                  <ExamBadge score={user.examScore} />
                </div>
                <div className="text-center border-l border-r border-border/40">
                  <p className="text-[10px] text-muted-foreground leading-none mb-1">
                    Онлайн
                  </p>
                  {user.onlineHours > 0 ? (
                    <span className="text-xs font-mono text-sky-400">
                      {user.onlineHours}ч
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">—</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground leading-none mb-1">
                    Офлайн
                  </p>
                  {user.offlineHours > 0 ? (
                    <span className="text-xs font-mono text-violet-400">
                      {user.offlineHours}ч
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">—</span>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="px-4 py-1.5 bg-muted/10">
                <p className="text-[10px] text-muted-foreground/60 font-mono text-right">
                  Регистрация:{" "}
                  {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
