const { Pool } = require("pg")
require("dotenv").config()

const databaseUrl =
  process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

const parsedUrl = new URL(databaseUrl)

console.log("DATABASE HOST:", parsedUrl.hostname)
console.log("DATABASE PORT:", parsedUrl.port)

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
})

module.exports = pool