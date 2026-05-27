require("dotenv").config()

const db = require("./db")
const pool = require("./pgdb")

const sections = db.prepare("SELECT * FROM sections").all()

async function migrateSections() {
  for (const section of sections) {
    await pool.query(
      `
      INSERT INTO sections (
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
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7,
        $8, $9,
        $10, $11,
        $12, $13,
        $14, $15,
        $16, $17,
        $18, $19,
        $20, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        heading = EXCLUDED.heading,
        text = EXCLUDED.text,

        card_title = EXCLUDED.card_title,
        card_text = EXCLUDED.card_text,

        card_1_title = EXCLUDED.card_1_title,
        card_1_text = EXCLUDED.card_1_text,

        card_2_title = EXCLUDED.card_2_title,
        card_2_text = EXCLUDED.card_2_text,

        card_3_title = EXCLUDED.card_3_title,
        card_3_text = EXCLUDED.card_3_text,

        card_4_title = EXCLUDED.card_4_title,
        card_4_text = EXCLUDED.card_4_text,

        card_5_title = EXCLUDED.card_5_title,
        card_5_text = EXCLUDED.card_5_text,

        card_6_title = EXCLUDED.card_6_title,
        card_6_text = EXCLUDED.card_6_text,

        media = EXCLUDED.media,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        section.id,
        section.title || "",
        section.subtitle || "",
        section.heading || "",
        section.text || "",

        section.card_title || "",
        section.card_text || "",

        section.card_1_title || "",
        section.card_1_text || "",

        section.card_2_title || "",
        section.card_2_text || "",

        section.card_3_title || "",
        section.card_3_text || "",

        section.card_4_title || "",
        section.card_4_text || "",

        section.card_5_title || "",
        section.card_5_text || "",

        section.card_6_title || "",
        section.card_6_text || "",

        section.media || "[]",
      ]
    )
  }

  console.log("Sections migrated to PostgreSQL:", sections.length)

  await pool.end()
}

migrateSections().catch((error) => {
  console.error(error)
  process.exit(1)
})