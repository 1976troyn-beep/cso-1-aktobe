require("dotenv").config()
const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      text TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      role TEXT DEFAULT 'Посетитель',
      approved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS partners (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      link TEXT,
      logo TEXT,
      visible INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      title TEXT,
      subtitle TEXT,
      heading TEXT,
      text TEXT,
      card_title TEXT,
      card_text TEXT,
      card_1_title TEXT,
      card_1_text TEXT,
      card_2_title TEXT,
      card_2_text TEXT,
      card_3_title TEXT,
      card_3_text TEXT,
      card_4_title TEXT,
      card_4_text TEXT,
      card_5_title TEXT,
      card_5_text TEXT,
      card_6_title TEXT,
      card_6_text TEXT,
      media JSONB DEFAULT '[]',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)

  console.log("PostgreSQL tables created")
  await pool.end()
}

init().catch((error) => {
  console.error(error)
  process.exit(1)
})