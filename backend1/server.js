import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import claudeRoutes from './routes/claude.js'
import stripeRoutes from './routes/stripe.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── CORS ──
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use((req, res, next) => {
  if (req.path === '/stripe/webhook') {
    express.raw({ type: 'application/json' })(req, res, next)
  } else {
    express.json()(req, res, next)
  }
})

// ── RATE LIMITING ──
// Global: max 60 zapytań na 15 minut per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Za dużo zapytań. Spróbuj ponownie za 15 minut.' }
})

// API (Claude): max 10 zapytań na 15 minut per IP – chroni budżet
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Przekroczono limit zapytań AI. Spróbuj ponownie za 15 minut.' }
})

app.use(globalLimiter)
app.use('/api', apiLimiter)

// ── ROUTES ──
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.use('/api', claudeRoutes)
app.use('/stripe', stripeRoutes)

app.listen(PORT, () => {
  console.log(`✅ JobTrack backend działa na http://localhost:${PORT}`)
  console.log(`🤖 Claude API: ${process.env.ANTHROPIC_API_KEY ? 'skonfigurowany' : '⚠️  brak klucza!'}`)
  console.log(`🛡️  Rate limiting: aktywny`)
})
