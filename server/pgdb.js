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

const isLocalDatabase =
  parsedUrl.hostname === "localhost" ||
  parsedUrl.hostname === "127.0.0.1" ||
  parsedUrl.hostname === "::1"

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabase
    ? false
    : {
        rejectUnauthorized: false,
      },
})

module.exports = pool