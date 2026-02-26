# JobTrack – Setup

## Wymagania
- Node.js 18+
- Konto Firebase (już skonfigurowane)
- Klucz API Anthropic

---

## 🚀 Uruchomienie lokalne

### 1. Backend
```bash
cd backend
cp .env.example .env
# Otwórz .env i wklej swój klucz Anthropic API
npm install
npm run dev
```
Backend działa na: http://localhost:3001

### 2. Frontend (nowe okno terminala)
```bash
cd frontend
npm install
npm run dev
```
Aplikacja działa na: http://localhost:5173

---

## 📁 Struktura
```
jobtrack/
├── frontend/          React + Vite + Tailwind + Firebase
│   └── src/
│       ├── pages/     Dashboard, Tracker, AIAssistant, Jobs, Analytics
│       ├── components/ Sidebar, AddAppModal, Toast
│       ├── hooks/     useApplications (Firestore)
│       ├── context/   AuthContext (Firebase Auth)
│       └── firebase.js
└── backend/           Express + Anthropic SDK
    ├── routes/claude.js  /api/analyze-cv, /api/analyze-skills
    └── server.js
```

---

## 🌐 Deploy

### Frontend → Netlify
```bash
cd frontend
npm run build
# Przeciągnij folder dist/ na Netlify
```
Dodaj zmienną środowiskową w Netlify:
- `VITE_API_URL` = URL Twojego backendu na Railway

### Backend → Railway
1. Wejdź na railway.app
2. New Project → Deploy from GitHub
3. Dodaj zmienną: `ANTHROPIC_API_KEY=sk-ant-...`
4. Railway automatycznie uruchomi `npm start`
