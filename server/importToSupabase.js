const fs = require("fs")
const { Pool } = require("pg")

const data = JSON.parse(
  fs.readFileSync("./railway-export.json", "utf8")
)

const pool = new Pool({
  connectionString:
    "postgresql://postgres.uiwvbwhpxywctdqonypj:troyn1976troyn@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
})

async function run() {
  console.log("IMPORT START")

  for (const row of data.reviews) {
    await pool.query(
      `
      INSERT INTO reviews
      (id,name,phone,text,rating,role,approved,created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        row.id,
        row.name,
        row.phone,
        row.text,
        row.rating,
        row.role,
        row.approved,
        row.created_at,
      ]
    )
  }

  for (const row of data.partners) {
    await pool.query(
      `
      INSERT INTO partners
      (id,title,description,link,logo,visible,created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        row.id,
        row.title,
        row.description,
        row.link,
        row.logo,
        row.visible,
        row.created_at,
      ]
    )
  }

  for (const row of data.sections) {
    await pool.query(
      `
      INSERT INTO sections
      (
        id,title,subtitle,heading,text,
        card_title,card_text,
        card_1_title,card_1_text,
        card_2_title,card_2_text,
        card_3_title,card_3_text,
        card_4_title,card_4_text,
        card_5_title,card_5_text,
        card_6_title,card_6_text,
        media,updated_at
      )
      VALUES
      (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,
        $16,$17,$18,$19,$20,$21
      )
      ON CONFLICT (id) DO NOTHING
      `,
      [
        row.id,
        row.title,
        row.subtitle,
        row.heading,
        row.text,
        row.card_title,
        row.card_text,
        row.card_1_title,
        row.card_1_text,
        row.card_2_title,
        row.card_2_text,
        row.card_3_title,
        row.card_3_text,
        row.card_4_title,
        row.card_4_text,
        row.card_5_title,
        row.card_5_text,
        row.card_6_title,
        row.card_6_text,
        JSON.stringify(row.media || {}),
        row.updated_at,
      ]
    )
  }

  console.log("REVIEWS:", data.reviews.length)
  console.log("PARTNERS:", data.partners.length)
  console.log("SECTIONS:", data.sections.length)

  await pool.end()

  console.log("IMPORT COMPLETE")
}
run().catch((error) => {
  console.log("ERROR MESSAGE:", error.message)
  console.log("ERROR CODE:", error.code)
  console.log("ERROR DETAIL:", error.detail)
  console.log("ERROR STACK:", error.stack)
})
