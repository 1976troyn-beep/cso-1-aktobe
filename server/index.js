const express = require("express")
const cors = require("cors")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()
const WebSocket = require("ws")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const pool = require("./pgdb")

const app = express()
const PORT = process.env.PORT || 4000
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    realtime: {
      transport: WebSocket,
    },
  }
)
app.use(helmet())

app.use(
  cors({
    origin: [
      "https://cso-1-aktobe.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
)

app.use(express.json())
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  message: {
    message:
      "Слишком много попыток входа. Попробуйте позже.",
  },
})
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN

const TELEGRAM_CHAT_ID =
  process.env.TELEGRAM_CHAT_ID

async function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return
  }

  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    )
  } catch (error) {
    console.error("TELEGRAM ERROR:", error)
  }
}
async function query(sql, params = []) {
  const result = await pool.query(sql, params)
  return result.rows
}

function getAqtobeDateTime() {
  return new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Aqtobe",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function parseMedia(media) {
  try {
    if (typeof media === "string") {
      return JSON.parse(media || "[]")
    }

    return media || []
  } catch {
    return []
  }
}

function fixMediaUrl(item) {
  if (!item || typeof item !== "object") return item

  return {
    ...item,
    src: item.src?.replace("http://localhost:4000", SERVER_URL),
    preview: item.preview?.replace("http://localhost:4000", SERVER_URL),
  }
}

function normalizeMedia(media) {
  const parsed = parseMedia(media)

  if (Array.isArray(parsed)) {
    return parsed.map(fixMediaUrl)
  }

  if (parsed && typeof parsed === "object") {
    const result = {}

    Object.entries(parsed).forEach(([key, value]) => {
      result[key] = Array.isArray(value)
        ? value.map(fixMediaUrl)
        : value
    })

    return result
  }

  return []
}

const upload = multer({
  storage: multer.memoryStorage(),
})

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: "Нет токена",
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(403).json({
      message: "Неверный токен",
    })
  }
}

/* ===================== SECTIONS ===================== */

app.get("/api/sections", async (req, res) => {
  try {
    const sections = await query(`
      SELECT *
      FROM sections
      ORDER BY
        CASE id
          WHEN 'hero' THEN 1
          WHEN 'services' THEN 2
          WHEN 'conditions' THEN 3
          WHEN 'rooms' THEN 4
          WHEN 'disability' THEN 5
          WHEN 'leadership' THEN 6
          WHEN 'specialists' THEN 7
          WHEN 'news' THEN 8
          WHEN 'documents' THEN 9
          WHEN 'reviews' THEN 10
          WHEN 'partners' THEN 11
          WHEN 'contacts' THEN 12
          ELSE 99
        END
    `)

    const parsedSections = sections.map((section) => ({
      ...section,
      media: normalizeMedia(section.media),
    }))

    res.json(parsedSections)
  } catch (error) {
    console.error("SECTIONS ERROR:", error)

    res.status(500).json({
      message: "Ошибка загрузки sections",
      error: String(error),
      stack: error.stack,
    })
  }
})

app.put("/api/sections/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params

  const {
    heading,
    text,
    card_title,
    card_text,
    card_1_title,
    card_1_text,
    card_2_title,
    card_2_text,
    card_3_title,
    card_3_text,
    card_4_title,
    card_4_text,
    card_5_title,
    card_5_text,
    card_6_title,
    card_6_text,
    media,
  } = req.body

  try {
    await pool.query(
      `
      UPDATE sections
      SET
        heading = $1,
        text = $2,
        card_title = $3,
        card_text = $4,
        card_1_title = $5,
        card_1_text = $6,
        card_2_title = $7,
        card_2_text = $8,
        card_3_title = $9,
        card_3_text = $10,
        card_4_title = $11,
        card_4_text = $12,
        card_5_title = $13,
        card_5_text = $14,
        card_6_title = $15,
        card_6_text = $16,
        media = $17,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $18
      `,
      [
        heading || "",
        text || "",
        card_title || "",
        card_text || "",
        card_1_title || "",
        card_1_text || "",
        card_2_title || "",
        card_2_text || "",
        card_3_title || "",
        card_3_text || "",
        card_4_title || "",
        card_4_text || "",
        card_5_title || "",
        card_5_text || "",
        card_6_title || "",
        card_6_text || "",
        JSON.stringify(media || []),
        id,
      ]
    )

    res.json({
      message: "Раздел успешно сохранён",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка сохранения раздела",
    })
  }
})

/* ===================== REVIEWS ===================== */

app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await query(`
      SELECT *
      FROM reviews
      ORDER BY id DESC
    `)

    res.json(reviews)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка загрузки отзывов",
    })
  }
})

app.get("/api/reviews/approved", async (req, res) => {
  try {
    const reviews = await query(`
      SELECT *
      FROM reviews
      WHERE approved = 1
      ORDER BY id DESC
    `)

    res.json(reviews)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка загрузки опубликованных отзывов",
    })
  }
})

app.post("/api/reviews", async (req, res) => {
  const { name, phone, text, rating, role } = req.body

  if (!name || !phone || !text) {
    return res.status(400).json({
      message: "Заполните все обязательные поля",
    })
  }

  try {
    const createdAt = getAqtobeDateTime()

    await pool.query(
      `
      INSERT INTO reviews (
        name,
        phone,
        text,
        rating,
        role,
        approved,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, 0, $6)
      `,
      [
        name.trim(),
        phone.trim(),
        text.trim(),
        Number(rating) || 5,
        role || "Посетитель",
        createdAt,
      ]
    )
    await sendTelegramMessage(
        `📝 Новый отзыв на сайте

      Имя: ${name}
      Телефон: ${phone}
      Оценка: ${Number(rating) || 5}
      Роль: ${role || "Посетитель"}

      Текст:
      ${text}`
      )
    res.json({
      message: "Отзыв отправлен на модерацию",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка отправки отзыва",
    })
  }
})

app.patch("/api/reviews/:id/approve", verifyAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `
      UPDATE reviews
      SET approved = 1
      WHERE id = $1
      `,
      [id]
    )

    res.json({
      message: "Отзыв опубликован",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка публикации отзыва",
    })
  }
})

app.patch("/api/reviews/:id/hide", verifyAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `
      UPDATE reviews
      SET approved = 0
      WHERE id = $1
      `,
      [id]
    )

    res.json({
      message: "Отзыв скрыт",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка скрытия отзыва",
    })
  }
})

app.delete("/api/reviews/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `
      DELETE FROM reviews
      WHERE id = $1
      `,
      [id]
    )

    res.json({
      message: "Отзыв удалён",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка удаления отзыва",
    })
  }
})

/* ===================== PARTNERS ===================== */

app.get("/api/partners", async (req, res) => {
  try {
    const partners = await query(`
      SELECT *
      FROM partners
      WHERE visible = 1
      ORDER BY id DESC
    `)

    res.json(partners)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка загрузки партнёров",
    })
  }
})

app.get("/api/admin/partners", verifyAdmin, async (req, res) => {
  try {
    const partners = await query(`
      SELECT *
      FROM partners
      ORDER BY id DESC
    `)

    res.json(partners)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка загрузки партнёров",
    })
  }
})

app.post("/api/partners", verifyAdmin, async (req, res) => {
  const { title, description, link, logo } = req.body

  if (!title) {
    return res.status(400).json({
      message: "Название партнёра обязательно",
    })
  }

  try {
    await pool.query(
      `
      INSERT INTO partners (
        title,
        description,
        link,
        logo
      )
      VALUES ($1, $2, $3, $4)
      `,
      [title || "", description || "", link || "", logo || ""]
    )

    res.json({
      message: "Партнёр добавлен",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка добавления партнёра",
    })
  }
})

app.patch("/api/partners/:id/hide", verifyAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `
      UPDATE partners
      SET visible = 0
      WHERE id = $1
      `,
      [id]
    )

    res.json({
      message: "Партнёр скрыт",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка скрытия партнёра",
    })
  }
})

app.patch("/api/partners/:id/show", verifyAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `
      UPDATE partners
      SET visible = 1
      WHERE id = $1
      `,
      [id]
    )

    res.json({
      message: "Партнёр опубликован",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка публикации партнёра",
    })
  }
})

app.delete("/api/partners/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `
      DELETE FROM partners
      WHERE id = $1
      `,
      [id]
    )

    res.json({
      message: "Партнёр удалён",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка удаления партнёра",
    })
  }
})

/* ===================== APPLICATIONS ===================== */

app.post("/api/applications", async (req, res) => {
  const { full_name, phone, email, message } = req.body

  if (!full_name || !phone) {
    return res.status(400).json({
      message: "Заполните имя и телефон",
    })
  }

  try {
    await pool.query(
      `
      INSERT INTO applications (
        full_name,
        phone,
        email,
        message
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        full_name.trim(),
        phone.trim(),
        email || "",
        message || "",
      ]
    )

    res.json({
      message: "Заявка успешно отправлена",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка отправки заявки",
    })
  }
})

app.get("/api/admin/applications", verifyAdmin, async (req, res) => {
  try {
    const applications = await query(`
      SELECT *
      FROM applications
      ORDER BY id DESC
    `)

    res.json(applications)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка загрузки заявок",
    })
  }
})

app.delete("/api/applications/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `
      DELETE FROM applications
      WHERE id = $1
      `,
      [id]
    )

    res.json({
      message: "Заявка удалена",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Ошибка удаления заявки",
    })
  }
})

/* ===================== UPLOAD ===================== */

/* ===================== UPLOAD ===================== */

app.post("/api/upload", verifyAdmin, upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Файлы не выбраны",
      })
    }

    const uploadedFiles = []

    for (const file of req.files) {
      const safeName = file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, "")

      const fileName = `${Date.now()}-${safeName}`

      const { error } = await supabase.storage
        .from("uploads")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        })

      if (error) {
        throw error
      }

      const { data } = supabase.storage
        .from("uploads")
        .getPublicUrl(fileName)

      uploadedFiles.push({
        id: fileName,
        type: file.mimetype.startsWith("video") ? "video" : "image",
        src: data.publicUrl,
        preview: data.publicUrl,
        name: file.originalname,
      })
    }

    res.json(uploadedFiles)
  } catch (error) {
    console.error("UPLOAD ERROR:", error)

    res.status(500).json({
      message: "Ошибка загрузки файлов",
      error: String(error),
    })
  }
})

/* ===================== ADMIN LOGIN ===================== */

app.post(
  "/api/admin/login",
  loginLimiter,
  async (req, res) => {
    const { login, password } = req.body

    if (!login || !password) {
      return res.status(400).json({
        message: "Введите логин и пароль",
      })
    }

    const validLogin =
      login === process.env.ADMIN_LOGIN

    const validPassword =
      await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD
      )

    if (!validLogin || !validPassword) {
      return res.status(401).json({
        message: "Неверный логин или пароль",
      })
    }

    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    )

    res.json({
      token,
    })
  }
)

/* ===================== START SERVER ===================== */

app.listen(PORT, () => {
  console.log(`Server started: ${SERVER_URL}`)
})