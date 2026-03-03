import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 8080)

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

const dataDir = path.join(process.cwd(), 'data')
const feedbackPath = path.join(dataDir, 'feedback.json')

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(feedbackPath)) fs.writeFileSync(feedbackPath, JSON.stringify([], null, 2))
}
ensureDataFile()

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'lost-and-found-server', time: new Date().toISOString() })
})

app.get('/api/stats', (req, res) => {
  // TODO: connect to DB and calculate real stats.
  // Mock numbers for the dashboard UI.
  res.json({
    foundOpen: 12,
    lostOpen: 9,
    claimsPending: 4,
    marketActive: 18,
    socialToday: 7,
  })
})

app.post('/api/feedback', (req, res) => {
  const { name = '', email = '', category = 'General', message = '' } = req.body || {}
  if (!message || !String(message).trim()) {
    return res.status(400).json({ ok: false, error: 'message_required' })
  }

  ensureDataFile()
  const current = JSON.parse(fs.readFileSync(feedbackPath, 'utf-8'))
  const record = {
    id: cryptoRandomId(),
    createdAt: new Date().toISOString(),
    name: String(name).slice(0, 80),
    email: String(email).slice(0, 120),
    category: String(category).slice(0, 40),
    message: String(message).slice(0, 2000),
  }
  current.unshift(record)
  fs.writeFileSync(feedbackPath, JSON.stringify(current, null, 2))
  res.json({ ok: true })
})

function cryptoRandomId() {
  // no dependency needed
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  ).toUpperCase()
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
