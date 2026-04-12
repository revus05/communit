"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2 } from "lucide-react"

interface StageCompletionFormProps {
  stageId: number
}

export function StageCompletionForm({ stageId }: StageCompletionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hours, setHours] = useState("")
  const [offline, setOffline] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const hoursValue = parseFloat(hours)
    if (!hours || isNaN(hoursValue) || hoursValue <= 0) {
      setError("Укажите корректное количество часов")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/training/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId, hoursSpent: hoursValue, attendedOffline: offline }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Произошла ошибка")
        return
      }

      router.refresh()
    } catch {
      setError("Не удалось подключиться к серверу")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="hours">Затраченное время (в часах)</Label>
        <Input
          id="hours"
          type="number"
          min="0.5"
          step="0.5"
          placeholder="например: 2"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-40"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="offline"
          checked={offline}
          onCheckedChange={(v) => setOffline(Boolean(v))}
        />
        <Label htmlFor="offline" className="cursor-pointer font-normal">
          Проходил занятия офлайн (в офисе)
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="gap-2">
        <CheckCircle2 size={15} />
        {loading ? "Сохранение..." : "Отметить как пройденный"}
      </Button>
    </form>
  )
}
