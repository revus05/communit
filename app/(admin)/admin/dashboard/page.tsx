import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

const STAGE_TITLES = [
  "Введение в банковское дело",
  "Регуляторная база и комплаенс",
  "Продуктовая линейка банка",
  "Работа с клиентами",
  "Операционные процессы",
  "Управление рисками",
  "Противодействие мошенничеству",
  "Цифровые каналы и технологии",
  "Корпоративная культура и ценности",
  "Итоговое закрепление знаний",
];

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      progress: {
        select: { stageId: true, hoursSpent: true, attendedOffline: true },
      },
      examResult: { select: { score: true } },
    },
  });

  const total = users.length;
  const completedTraining = users.filter(
    (u) => u.progress.length === 10,
  ).length;
  const inProgress = users.filter(
    (u) => u.progress.length > 0 && u.progress.length < 10,
  ).length;
  const notStarted = users.filter((u) => u.progress.length === 0).length;

  const examScores = users
    .filter((u) => u.examResult !== null)
    .map((u) => u.examResult!.score);
  const examTaken = examScores.length;
  const examPassed = examScores.filter((s) => s >= 60).length;
  const avgExamScore =
    examScores.length > 0
      ? Math.round(examScores.reduce((a, b) => a + b, 0) / examScores.length)
      : null;

  const examExcellent = examScores.filter((s) => s >= 80).length;
  const examGood = examScores.filter((s) => s >= 60 && s < 80).length;
  const examFailed = examScores.filter((s) => s < 60).length;

  // Distribution: bucket i = students currently working on stage (i+1)
  // i.e. users who completed exactly i stages
  const stageDistribution = Array.from({ length: 11 }, (_, i) => ({
    label: i === 10 ? "Завершили обучение" : STAGE_TITLES[i],
    stageNum: i === 10 ? "✓" : String(i + 1),
    isCompleted: i === 10,
    count: users.filter((u) => u.progress.length === i).length,
  }));
  const maxCount = Math.max(...stageDistribution.map((s) => s.count), 1);

  const totalHours = users.reduce(
    (acc, u) => acc + u.progress.reduce((s, p) => s + p.hoursSpent, 0),
    0,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Дашборд"
        description="Общая статистика по обучению сотрудников"
      />

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Студентов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono">{total}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-[10px] font-mono text-muted-foreground">
                {notStarted} не начали
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                ·
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {inProgress} в процессе
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Завершили
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono text-[var(--color-success)]">
              {completedTraining}
            </p>
            {total > 0 && (
              <div className="mt-2 space-y-1">
                <div className="h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-success)] transition-all"
                    style={{ width: `${(completedTraining / total) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {Math.round((completedTraining / total) * 100)}% от всех
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Сдали тест
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono text-sky-400">
              {examTaken}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground mt-2">
              {examPassed} прошли порог 60%
            </p>
          </CardContent>
        </Card>

        {/* Avg score */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Средний балл
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                "text-3xl font-bold font-mono",
                avgExamScore === null
                  ? "text-muted-foreground"
                  : avgExamScore >= 80
                    ? "text-[var(--color-success)]"
                    : avgExamScore >= 60
                      ? "text-yellow-400"
                      : "text-destructive",
              )}
            >
              {avgExamScore !== null ? `${avgExamScore}%` : "—"}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground mt-2">
              {totalHours.toFixed(1)} ч. суммарно
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Stage distribution + Exam breakdown ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stage funnel */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 border-b border-border/60">
            <CardTitle className="text-sm font-medium">
              Распределение по этапам
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Сколько студентов сейчас на каждом этапе
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2.5">
              {stageDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {/* Stage number badge */}
                  <div
                    className={cn(
                      "w-6 h-5 rounded text-[10px] font-mono font-semibold flex items-center justify-center shrink-0",
                      item.isCompleted
                        ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                        : "bg-primary/10 text-primary/70",
                    )}
                  >
                    {item.stageNum}
                  </div>

                  {/* Label + bar */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground truncate mb-1 leading-none">
                      {item.label}
                    </p>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          item.isCompleted
                            ? "bg-[var(--color-success)]"
                            : "bg-primary",
                        )}
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Count */}
                  <span
                    className={cn(
                      "text-xs font-mono font-semibold w-5 text-right shrink-0",
                      item.isCompleted
                        ? "text-[var(--color-success)]"
                        : item.count > 0
                          ? "text-foreground"
                          : "text-muted-foreground/30",
                    )}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam breakdown */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-2 border-b border-border/60">
              <CardTitle className="text-sm font-medium">
                Результаты теста
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {examTaken > 0
                  ? `${examTaken} из ${total} сдавали`
                  : "Никто не сдавал"}
              </p>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                {
                  label: "Отлично",
                  sublabel: "≥ 80%",
                  value: examExcellent,
                  color: "text-[var(--color-success)]",
                  bg: "bg-[var(--color-success)]",
                },
                {
                  label: "Хорошо",
                  sublabel: "60 – 79%",
                  value: examGood,
                  color: "text-yellow-400",
                  bg: "bg-yellow-400",
                },
                {
                  label: "Не сдал",
                  sublabel: "< 60%",
                  value: examFailed,
                  color: "text-destructive",
                  bg: "bg-destructive",
                },
                {
                  label: "Не сдавали",
                  sublabel: "—",
                  value: total - examTaken,
                  color: "text-muted-foreground",
                  bg: "bg-muted-foreground/30",
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2.5">
                  <div
                    className={cn("w-2 h-2 rounded-full shrink-0", row.bg)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-none">
                      {row.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {row.sublabel}
                    </p>
                  </div>
                  <span
                    className={cn("text-lg font-bold font-mono", row.color)}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Часы обучения
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Онлайн</span>
                <span className="text-sm font-mono font-semibold text-sky-400">
                  {users
                    .reduce(
                      (acc, u) =>
                        acc +
                        u.progress
                          .filter((p) => !p.attendedOffline)
                          .reduce((s, p) => s + p.hoursSpent, 0),
                      0,
                    )
                    .toFixed(1)}{" "}
                  ч.
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Офлайн</span>
                <span className="text-sm font-mono font-semibold text-violet-400">
                  {users
                    .reduce(
                      (acc, u) =>
                        acc +
                        u.progress
                          .filter((p) => p.attendedOffline)
                          .reduce((s, p) => s + p.hoursSpent, 0),
                      0,
                    )
                    .toFixed(1)}{" "}
                  ч.
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border/60 pt-2 mt-2">
                <span className="text-xs text-muted-foreground">Итого</span>
                <span className="text-sm font-mono font-semibold">
                  {totalHours.toFixed(1)} ч.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
