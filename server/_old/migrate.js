require("dotenv").config()

const sqlite3 = require("sqlite3").verbose()
const { Pool } = require("pg")

const sqlite = new sqlite3.Database("./database.sqlite")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function migrateReviews() {
  return new Promise((resolve, reject) => {
    sqlite.all("SELECT * FROM reviews", async (err, rows) => {
      if (err) {
        reject(err)
        return
      }

      for (const review of rows) {
        await pool.query(
          `
          INSERT INTO reviews
          (
            name,
            phone,
            text,
            rating,
            role,
            approved,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          `,
          [
            review.name,
            review.phone || "",
            review.text,
            review.rating || 5,
            review.role || "Посетитель",
            review.approved || 0,
            review.created_at || new Date().toISOString(),
          ]
        )
      }

      console.log("Reviews migrated")
      resolve()
    })
  })
}

async function migrateSections() {
  return new Promise((resolve, reject) => {
    sqlite.all("SELECT * FROM sections", async (err, rows) => {
      if (err) {
        reject(err)
        return
      }

      for (const section of rows) {
        await pool.query(
          `
          INSERT INTO sections
          (
            id,
            title,
            subtitle,
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
            updated_at
          )
          VALUES
          (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,
            $16,$17,$18,$19,$20,$21
          )
          `,
          [
            section.id,
            section.title,
            section.subtitle,
            section.heading,
            section.text,
            section.card_title,
            section.card_text,
            section.card_1_title,
            section.card_1_text,
            section.card_2_title,
            section.card_2_text,
            section.card_3_title,
            section.card_3_text,
            section.card_4_title,
            section.card_4_text,
            section.card_5_title,
            section.card_5_text,
            section.card_6_title,
            section.card_6_text,
            JSON.stringify(section.media || []),
            section.updated_at || new Date().toISOString(),
          ]
        )
      }

      console.log("Sections migrated")
      resolve()
    })
  })
}

async function start() {
  try {
    await migrateReviews()
    await migrateSections()

    console.log("Migration completed")

    sqlite.close()
    await pool.end()
  } catch (error) {
    console.error(error)
  }
}

start()