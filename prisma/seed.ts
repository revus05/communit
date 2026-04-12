import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"
import { hashPassword } from "../lib/password"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const stages = [
  {
    id: 1,
    title: "Введение в банковское дело",
    description:
      "Ознакомление с основными принципами банковской деятельности, структурой банка и ключевыми понятиями финансовой системы. Изучите историю развития банковского сектора и место нашего банка в нём.",
    fileUrl: "/uploads/stage-01.pdf",
    fileName: "01-введение-в-банковское-дело.pdf",
  },
  {
    id: 2,
    title: "Регуляторная база и комплаенс",
    description:
      "Изучение нормативно-правовой базы банковской деятельности: законодательство, требования регулятора, внутренние политики и процедуры. Комплаенс как основа доверия клиентов.",
    fileUrl: "/uploads/stage-02.pdf",
    fileName: "02-регуляторная-база-и-комплаенс.pdf",
  },
  {
    id: 3,
    title: "Продуктовая линейка банка",
    description:
      "Обзор всех продуктов и услуг банка: депозиты, кредиты, карточные продукты, расчётно-кассовое обслуживание, инвестиционные продукты. Особенности каждого продукта и целевая аудитория.",
    fileUrl: "/uploads/stage-03.pdf",
    fileName: "03-продуктовая-линейка.pdf",
  },
  {
    id: 4,
    title: "Работа с клиентами",
    description:
      "Стандарты клиентского сервиса, техники продаж и работы с возражениями. Этика делового общения, правила ведения переговоров и разрешения конфликтных ситуаций.",
    fileUrl: "/uploads/stage-04.pdf",
    fileName: "04-работа-с-клиентами.pdf",
  },
  {
    id: 5,
    title: "Операционные процессы",
    description:
      "Базовые операционные процессы: открытие счетов, проведение платежей, обработка заявок. Работа с банковскими системами и программным обеспечением.",
    fileUrl: "/uploads/stage-05.pdf",
    fileName: "05-операционные-процессы.pdf",
  },
  {
    id: 6,
    title: "Управление рисками",
    description:
      "Основы риск-менеджмента в банке: кредитный, операционный, рыночный и репутационный риски. Инструменты оценки и минимизации рисков на уровне сотрудника.",
    fileUrl: "/uploads/stage-06.pdf",
    fileName: "06-управление-рисками.pdf",
  },
  {
    id: 7,
    title: "Противодействие мошенничеству",
    description:
      "Методы выявления и предотвращения мошеннических операций. Типичные схемы мошенничества, признаки подозрительных операций и порядок действий при их обнаружении.",
    fileUrl: "/uploads/stage-07.pdf",
    fileName: "07-противодействие-мошенничеству.pdf",
  },
  {
    id: 8,
    title: "Цифровые каналы и технологии",
    description:
      "Цифровая трансформация банка: интернет-банкинг, мобильные приложения, API-интеграции. Тренды финтех-рынка и стратегия цифрового развития банка.",
    fileUrl: "/uploads/stage-08.pdf",
    fileName: "08-цифровые-каналы.pdf",
  },
  {
    id: 9,
    title: "Корпоративная культура и ценности",
    description:
      "Миссия, видение и ценности банка. Корпоративный кодекс, деловая этика, внутренние коммуникации. Структура организации и карьерные возможности.",
    fileUrl: "/uploads/stage-09.pdf",
    fileName: "09-корпоративная-культура.pdf",
  },
  {
    id: 10,
    title: "Итоговое закрепление знаний",
    description:
      "Систематизация полученных знаний, разбор практических кейсов и типичных рабочих ситуаций. Подготовка к финальному тестированию и дальнейшее развитие в банке.",
    fileUrl: "/uploads/stage-10.pdf",
    fileName: "10-итоговое-закрепление.pdf",
  },
]

async function main() {
  console.log("Seeding database...")

  for (const stage of stages) {
    await prisma.stage.upsert({
      where: { id: stage.id },
      update: stage,
      create: stage,
    })
  }
  console.log("Stages seeded.")

  await prisma.user.upsert({
    where: { email: "admin@bank.local" },
    update: {},
    create: {
      name: "Администратор",
      email: "admin@bank.local",
      passwordHash: await hashPassword("Admin123!"),
      role: "ADMIN",
    },
  })
  console.log("Admin user seeded: admin@bank.local / Admin123!")

  console.log("Done.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
