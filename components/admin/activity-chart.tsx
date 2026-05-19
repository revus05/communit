"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DayData = {
  date: string // YYYY-MM-DD
  count: number
}

interface ActivityChartProps {
  weekData: DayData[]
  monthData: DayData[]
}

export function ActivityChart({ weekData, monthData }: ActivityChartProps) {
  const [period, setPeriod] = useState<"week" | "month">("week")
  const data = period === "week" ? weekData : monthData
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const total = data.reduce((s, d) => s + d.count, 0)

  const formatLabel = (date: string, idx: number) => {
    const d = new Date(date + "T00:00:00")
    if (period === "week") {
      return d.toLocaleDateString("ru-RU", { weekday: "short" })
    }
    // month: show label every 6 bars
    if (idx % 6 === 0) {
      return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
    }
    return ""
  }

  return (
    <Card>
      <CardHeader className="pb-2 border-b border-border/60">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-medium">Активность студентов</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {total > 0 ? `${total} задач выполнено за период` : "Нет активности за период"}
            </p>
          </div>
          <div className="flex rounded-md overflow-hidden border border-border/60 text-xs font-mono shrink-0">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-2.5 py-1 transition-colors",
                  period === p
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted/40",
                )}
              >
                {p === "week" ? "7 дней" : "30 дней"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-end gap-[2px] h-28">
          {data.map((day, idx) => {
            const heightPct = (day.count / maxCount) * 100
            const label = formatLabel(day.date, idx)
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end" style={{ height: "80px" }}>
                  <div
                    className={cn(
                      "w-full rounded-sm transition-all duration-500",
                      day.count > 0 ? "bg-primary/60 hover:bg-primary/80" : "bg-border/40",
                    )}
                    style={{
                      height: day.count > 0 ? `${heightPct}%` : "3px",
                    }}
                    title={`${day.date}: ${day.count} задач`}
                  />
                </div>
                <span
                  className="text-[9px] font-mono text-muted-foreground leading-none text-center truncate w-full"
                  style={{ visibility: label ? "visible" : "hidden" }}
                >
                  {label || "."}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
