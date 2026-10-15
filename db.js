import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'

const db = new DatabaseSync(fileURLToPath(new URL('./weather.db', import.meta.url)))

db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    weather TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`)

const insertRequest = db.prepare(
  'INSERT INTO requests (city, weather, created_at) VALUES (?, ?, ?)',
)
const listRequests = db.prepare(
  'SELECT id, city, weather, created_at FROM requests ORDER BY id DESC LIMIT 12',
)

export function addRequest(city, weather) {
  insertRequest.run(city, weather, new Date().toISOString())
}

export function getRequests() {
  return listRequests.all()
}
