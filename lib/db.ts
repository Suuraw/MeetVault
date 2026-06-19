import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let db: Database.Database | null = null

function getDb() {
  if (db) return db

  const dataDir = path.join(process.cwd(), '.data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const dbPath = path.join(dataDir, 'meetvault.db')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  // Initialize schema
  initializeSchema()

  return db
}

function initializeSchema() {
  const db = getDb()

  // Create meetings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      duration TEXT DEFAULT '0:00',
      tags TEXT NOT NULL DEFAULT '[]',
      transcript TEXT NOT NULL DEFAULT '',
      highlights TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `)

  // Create segments table (kept for backward compatibility)
  db.exec(`
    CREATE TABLE IF NOT EXISTS segments (
      id TEXT PRIMARY KEY,
      meetingId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      text TEXT NOT NULL,
      highlight TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (meetingId) REFERENCES meetings(id) ON DELETE CASCADE
    )
  `)

  // Create index for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_segments_meetingId ON segments(meetingId)
  `)
}

export { getDb }
