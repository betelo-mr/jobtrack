import Anthropic from '@anthropic-ai/sdk'
import { Router } from 'express'
import multer from 'multer'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

const router = Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Tylko pliki PDF są obsługiwane.'))
  }
})

function parseJSON(text) {
  const clean = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(clean)
}

async function extractCvText(req) {
  if (req.file) {
    const parsed = await pdfParse(req.file.buffer)
    if (!parsed.text?.trim()) throw new Error('Nie udało się odczytać tekstu z PDF. Upewnij się, że PDF nie jest skanem.')
    return parsed.text.trim().slice(0, 3000)
  }
  return (req.body.cvText || '').slice(0, 3000)
}

// ── CV ANALYSIS ──
router.post('/analyze-cv', upload.single('cvPdf'), async (req, res) => {
  try {
    const jobDesc = req.body.jobDesc
    if (!jobDesc) return res.status(400).json({ error: 'Brakuje treści ogłoszenia.' })
    const cvText = await extractCvText(req)
    if (!cvText.trim()) return res.status(400).json({ error: 'Brakuje treści CV.' })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Jesteś ekspertem HR. Przeanalizuj dopasowanie CV do ogłoszenia.

OGŁOSZENIE:
${jobDesc.slice(0, 2000)}

CV:
${cvText}

Odpowiedz TYLKO w formacie JSON (bez markdown, bez \`\`\`). Maksymalnie 5 elementów w każdej tablicy:
{
  "matchScore": <0-100>,
  "matchLabel": "<Słabe/Średnie/Dobre/Świetne dopasowanie>",
  "summary": "<1 zdanie>",
  "matchedKeywords": ["max 5 słów"],
  "missingKeywords": ["max 5 słów"],
  "suggestions": ["max 3 sugestie, każda max 100 znaków"]
}`
      }]
    })

    res.json(parseJSON(message.content[0].text))
  } catch(e) {
    console.error(e)
    res.status(500).json({ error: 'Błąd analizy CV: ' + e.message })
  }
})

// ── SKILLS MAP ──
router.post('/analyze-skills', upload.single('cvPdf'), async (req, res) => {
  try {
    const goal = req.body.goal
    if (!goal) return res.status(400).json({ error: 'Podaj cel zawodowy.' })
    const cvText = await extractCvText(req)
    if (!cvText.trim()) return res.status(400).json({ error: 'Wklej CV lub wgraj PDF.' })

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `Jesteś ekspertem kariery. Na podstawie CV stwórz mapę umiejętności dla roli: "${goal}".

CV:
${cvText}

Odpowiedz TYLKO w formacie JSON (bez markdown, bez \`\`\`). Max 5 skills, 4 kroki roadmapy, 4 kursy. Każdy opis max 80 znaków:
{
  "readiness": <0-100>,
  "timeEstimate": "<np. ~3 mies.>",
  "gaps": ["max 4 luki"],
  "skills": [
    { "name": "<max 30 znaków>", "description": "<max 80 znaków>", "status": "<done|partial|missing>", "level": <0-100> }
  ],
  "roadmap": [
    { "title": "<max 50 znaków>", "description": "<max 80 znaków>", "time": "<max 30 znaków>" }
  ],
  "courses": [
    { "platform": "<max 15 znaków>", "title": "<max 50 znaków>", "duration": "<max 20 znaków>", "price": "<max 20 znaków>", "free": <true|false> }
  ]
}`
      }]
    })

    res.json(parseJSON(message.content[0].text))
  } catch(e) {
    console.error(e)
    res.status(500).json({ error: 'Błąd analizy: ' + e.message })
  }
})

// ── TAILOR CV ──
router.post('/tailor-cv', upload.single('cvPdf'), async (req, res) => {
  try {
    const jobDesc = req.body.jobDesc
    if (!jobDesc) return res.status(400).json({ error: 'Brakuje treści ogłoszenia.' })
    const cvText = await extractCvText(req)
    if (!cvText.trim()) return res.status(400).json({ error: 'Brakuje treści CV.' })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Jesteś ekspertem kariery i copywriterem CV. Dostosuj CV kandydata do konkretnej oferty pracy.

ZASADY:
- Nie wymyślaj nowych doświadczeń ani umiejętności których nie ma w CV
- Przepisz istniejące treści używając języka i słów kluczowych z ogłoszenia
- Przebuduj kolejność i akcenty – wysuń na pierwszy plan to co pasuje do oferty
- Popraw podsumowanie zawodowe pod tę konkretną rolę
- Zachowaj wszystkie daty, firmy i stanowiska – tylko język może się zmienić
- Pisz po polsku jeśli CV jest po polsku, po angielsku jeśli po angielsku

OGŁOSZENIE:
${jobDesc.slice(0, 2000)}

CV KANDYDATA:
${cvText}

Odpowiedz TYLKO w formacie JSON (bez markdown, bez \`\`\`):
{
  "summary": "<1 zdanie co zostało zmienione i dlaczego>",
  "changes": ["zmiana 1 max 80 znaków", "zmiana 2", "zmiana 3", "zmiana 4"],
  "tailoredCV": "<pełne przepisane CV w formacie markdown>"
}`
      }]
    })

    res.json(parseJSON(message.content[0].text))
  } catch(e) {
    console.error(e)
    res.status(500).json({ error: 'Błąd dostosowania CV: ' + e.message })
  }
})

export default router
