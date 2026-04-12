import { ExternalLink, Trophy } from "lucide-react"

interface ExamLinkBannerProps {
  examScore: number | null
}

export function ExamLinkBanner({ examScore }: ExamLinkBannerProps) {
  const examUrl = process.env.NEXT_PUBLIC_EXAM_FORM_URL

  if (examScore !== null) {
    return (
      <div className="rounded-lg border border-[var(--color-success)]/30 bg-[var(--color-success)]/8 p-4">
        <div className="flex items-center gap-3">
          <Trophy size={18} className="text-[var(--color-success)] shrink-0" />
          <div>
            <p className="text-sm font-semibold">Тест пройден!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ваш результат: <span className="text-[var(--color-success)] font-mono font-semibold">{examScore}%</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 shadow-[0_0_20px_oklch(0.62_0.20_245/8%)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Обучение завершено!</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Вы успешно прошли все 10 этапов. Теперь необходимо сдать итоговый экзамен. Нажмите на кнопку для перехода к тесту.
          </p>
        </div>
        {examUrl && (
          <a
            href={examUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            Пройти тест
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  )
}
