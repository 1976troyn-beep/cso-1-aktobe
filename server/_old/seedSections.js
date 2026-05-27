require("dotenv").config()
const pool = require("./pgdb")

const sections = [
  ["hero", "Главная", "Главный экран сайта"],
  ["services", "Услуги", "Услуги учреждения"],
  ["conditions", "Условия", "Условия проживания"],
  ["rooms", "Комнаты", "Комнаты проживания"],
  ["disability", "Доступная среда", "Поддержка инвалидности"],
  ["leadership", "Руководство", "Администрация учреждения"],
  ["specialists", "Специалисты", "Сотрудники центра"],
  ["news", "Новости", "Новости и события"],
  ["documents", "Документы", "Документы учреждения"],
  ["reviews", "Отзывы", "Отзывы посетителей"],
  ["partners", "Партнёры", "Партнёрские организации"],
  ["contacts", "Контакты", "Контактная информация"],
]

async function seed() {
  for (const section of sections) {
    await pool.query(
      `
      INSERT INTO sections (
        id,
        title,
        subtitle,
        heading,
        text,
        media
      )
      VALUES ($1, $2, $3, '', '', '[]')
      ON CONFLICT (id) DO NOTHING
      `,
      section
    )
  }

  console.log("Sections seeded")
  await pool.end()
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})