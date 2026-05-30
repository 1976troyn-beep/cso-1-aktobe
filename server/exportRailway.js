require("dotenv").config()
const fs = require("fs")
const pool = require("./pgdb")

async function run() {
  const reviews = await pool.query("SELECT * FROM reviews")
  const partners = await pool.query("SELECT * FROM partners")
  const sections = await pool.query("SELECT * FROM sections")

  const data = {
    reviews: reviews.rows,
    partners: partners.rows,
    sections: sections.rows,
  }

  fs.writeFileSync(
    "railway-export.json",
    JSON.stringify(data, null, 2)
  )

  console.log("EXPORT DONE")

  console.log("reviews:", reviews.rows.length)
  console.log("partners:", partners.rows.length)
  console.log("sections:", sections.rows.length)

  await pool.end()
}

run().catch(console.error)