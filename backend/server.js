import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import claudeRoutes from './routes/claude.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.use('/api', claudeRoutes)

app.listen(PORT, () => {
  console.log(`✅ JobTrack backend działa na http://localhost:${PORT}`)
  console.log(`🤖 Claude API: ${process.env.ANTHROPIC_API_KEY ? 'skonfigurowany' : '⚠️  brak klucza!'}`)
})
