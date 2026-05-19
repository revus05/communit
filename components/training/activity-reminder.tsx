"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LAST_VISIT_KEY = "training_last_visit"
const GOOD_PROGRESS_SHOWN_KEY = "training_good_progress_shown"
const INACTIVITY_THRESHOLD_DAYS = 7

type ModalType = "inactive" | "good_progress" | null

interface ActivityReminderProps {
  completedCount: number
  totalCount: number
  testMode?: boolean
}

export function ActivityReminder({ completedCount, totalCount, testMode }: ActivityReminderProps) {
  const [modal, setModal] = useState<ModalType>(null)
  const [daysSince, setDaysSince] = useState(0)

  useEffect(() => {
    if (testMode) {
      setModal("good_progress")
      return
    }

    const lastVisitRaw = localStorage.getItem(LAST_VISIT_KEY)
    const now = Date.now()
    localStorage.setItem(LAST_VISIT_KEY, String(now))

    if (!lastVisitRaw) return // first ever visit — don't show anything

    const elapsed = now - Number(lastVisitRaw)
    const days = elapsed / (1000 * 60 * 60 * 24)

    if (days >= INACTIVITY_THRESHOLD_DAYS) {
      setDaysSince(Math.floor(days))
      setModal("inactive")
      triggerWebNotification(
        "Пора учиться!",
        `Вы не заходили ${Math.floor(days)} дн. Продолжите обучение — вы на ${completedCount} из ${totalCount} этапах.`,
      )
      return
    }

    // Good progress: 70 %+ complete but not finished, show once per day
    if (completedCount >= Math.ceil(totalCount * 0.7) && completedCount < totalCount) {
      const shownDate = localStorage.getItem(GOOD_PROGRESS_SHOWN_KEY)
      const today = new Date().toDateString()
      if (shownDate !== today) {
        localStorage.setItem(GOOD_PROGRESS_SHOWN_KEY, today)
        setModal("good_progress")
        triggerWebNotification(
          "Отличный прогресс!",
          `${completedCount} из ${totalCount} этапов пройдено. Вы почти у финиша!`,
        )
      }
    }
  }, [completedCount, totalCount, testMode])

  async function triggerWebNotification(title: string, body: string) {
    if (!("Notification" in window)) return
    let perm = Notification.permission
    if (perm === "default") {
      perm = await Notification.requestPermission()
    }
    if (perm === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" })
    }
  }

  if (!modal) return null

  const isInactive = modal === "inactive"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-sm mx-4 shadow-2xl shadow-black/50 border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {isInactive ? "Давно не виделись" : "Так держать!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isInactive
              ? `Вы не заходили на курс ${daysSince} ${pluralDays(daysSince)}. Не останавливайтесь — продолжите с того места, где остановились!`
              : `Вы прошли ${completedCount} из ${totalCount} этапов — это ${Math.round((completedCount / totalCount) * 100)}%. До финиша совсем немного, продолжайте в том же духе!`}
          </p>
          <Button
            className="w-full"
            onClick={() => {
              if (testMode && modal === "good_progress") {
                setDaysSince(12)
                setModal("inactive")
              } else {
                setModal(null)
              }
            }}
          >
            {isInactive ? "Продолжить обучение" : "Спасибо, продолжу!"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function pluralDays(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "день"
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "дня"
  return "дней"
}
