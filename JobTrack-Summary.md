# JobTrack – Podsumowanie projektu

> Dokument do użycia w nowym czacie lub z innym AI. Zawiera pełny kontekst projektu, stack techniczny, aktualny stan i plan dalszych działań.

---

## 🧑‍💼 Kontekst biznesowy

**Produkt:** JobTrack – AI Career Assistant dla osób szukających pracy w Polsce  
**Model biznesowy:** SaaS, freemium  
**Ceny:**
- Free: 3 analizy AI łącznie/miesiąc
- Pro: 49 zł/miesiąc (subskrypcja Stripe)

**Cel krótkoterminowy:** 500 płatnych userów = 24 500 zł MRR  
**Właściciel:** Mariusz (firma Betelo, NIP: posiada działalność gospodarczą)

---

## 🛠️ Stack techniczny

### Frontend
- React 18 + Vite 5
- Tailwind CSS 3
- Firebase 10 (Firestore + Auth)
- Font: Lexend (Google Fonts)
- Hosting: **Netlify** (auto-deploy z GitHub)

### Backend
- Node.js 22 + Express 4
- Anthropic SDK (`claude-opus-4-6`)
- Multer (upload PDF)
- pdf-parse
- express-rate-limit
- Stripe SDK v14
- Hosting: **Railway**

### Baza danych
- Firebase Firestore (europe-west)
- Kolekcja: `users/{uid}` – dane usera, isPro, onboardingCompleted, goal, newsletter
- Kolekcja: `users/{uid}/usage/{rok-miesiac}` – licznik analiz (count)
- Kolekcja: `applications/{uid}/items/{id}` – tracker aplikacji

### Auth
- Firebase Authentication
- Google OAuth + Email/Password

---

## 🌐 Adresy produkcyjne

| Serwis | URL |
|--------|-----|
| Frontend (Netlify) | *[Twój URL Netlify]* |
| Backend (Railway) | `https://jobtrack-production-a4e0.up.railway.app` |
| Firebase Console | `console.firebase.google.com/project/jobtrack-pl` |
| GitHub repo | `github.com/betelo-mr/jobtrack` (prywatne) |
| Stripe Dashboard | `dashboard.stripe.com` |

---

## 📁 Struktura projektu

```
jobtrack/
├── frontend/                        # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Landing page (niezalogowani)
│   │   │   ├── AuthPage.jsx         # Logowanie/rejestracja
│   │   │   ├── Dashboard.jsx        # Główny dashboard
│   │   │   ├── Tracker.jsx          # Tracker aplikacji
│   │   │   ├── AIAssistant.jsx      # AI tools (analiza, dostosowanie, mapa)
│   │   │   ├── Jobs.jsx             # Coming Soon
│   │   │   └── Analytics.jsx        # Coming Soon
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Nawigacja + dark mode toggle + wersja
│   │   │   ├── OnboardingWizard.jsx # Wizard dla nowych userów (3 kroki)
│   │   │   ├── UpgradeModal.jsx     # Modal upgrade do Pro (Stripe)
│   │   │   ├── ComingSoon.jsx       # Placeholder dla Jobs/Analytics
│   │   │   ├── AddAppModal.jsx      # Modal dodawania aplikacji
│   │   │   └── Toast.jsx            # Powiadomienia
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Firebase Auth context
│   │   │   └── ThemeContext.jsx     # Dark/light mode context
│   │   ├── hooks/
│   │   │   ├── useApplications.js   # Hook do trackera aplikacji
│   │   │   └── useUsage.js          # Hook do limitu analiz (Firestore)
│   │   ├── utils/
│   │   │   └── affiliateLinks.js    # Linki afiliacyjne Udemy/Coursera
│   │   ├── firebase.js              # Firebase config
│   │   ├── version.js               # Wersja aplikacji (aktualizuj ręcznie!)
│   │   ├── App.jsx                  # Główny router
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind + CSS variables (dark mode)
│   ├── netlify.toml                 # Proxy + redirects
│   └── tailwind.config.js
│
└── backend/                         # Express API
    ├── routes/
    │   ├── claude.js                # Endpointy AI (/analyze-cv, /analyze-skills, /tailor-cv)
    │   └── stripe.js                # Płatności (/create-checkout, /customer-portal, /webhook)
    ├── server.js                    # Express + rate limiting
    └── package.json
```

---

## 🔑 Zmienne środowiskowe

### Railway (backend)
```
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_... (zmienić na sk_live_ po weryfikacji)
FRONTEND_URL=https://[twoj-netlify-url]
```

### Netlify (frontend)
```
VITE_STRIPE_PUBLIC_KEY=pk_test_... (zmienić na pk_live_ po weryfikacji)
SECRETS_SCAN_SMART_DETECTION_ENABLED=false
```

---

## ✅ Zrealizowane funkcjonalności

### MVP (v1.0)
- [x] Rejestracja i logowanie (Google + email)
- [x] Tracker aplikacji (Firestore)
- [x] Analiza CV vs oferta pracy (Claude AI)
- [x] Dostosowanie CV pod ofertę (Claude AI)
- [x] Mapa umiejętności i plan kariery (Claude AI)
- [x] Obsługa PDF (upload + parsowanie)

### v1.4.0
- [x] Landing page (polski, pełny)
- [x] Coming Soon dla Ofert i Analityki (z email waitlist)
- [x] Linki afiliacyjne do kursów (Udemy, Coursera, YouTube)
- [x] Cena 49 zł/mies.
- [x] Numer wersji w sidebarze

### v1.5.0
- [x] Integracja Stripe (Checkout Sessions)
- [x] Modal Upgrade do Pro
- [x] Stripe Customer Portal (zarządzanie subskrypcją)
- [x] Rate limiting (10 req/15min per IP dla AI endpoints)

### v1.6.0
- [x] Dark mode (OLED black #0a0a0a)
- [x] Auto-detect z systemu (prefers-color-scheme)
- [x] Przełącznik ręczny w sidebarze
- [x] Zapis preferencji w localStorage

### v1.7.0
- [x] Limit 3 analiz/miesiąc dla Free (Firestore counter)
- [x] Banner z licznikiem pozostałych analiz
- [x] Blokada po wyczerpaniu limitu + CTA do Pro
- [x] Branding: zastąpienie "Claude" → "JobTrack" w UI

### v1.8.0
- [x] Onboarding Wizard (3 kroki: cel zawodowy, newsletter, powitanie)
- [x] Zapis onboardingCompleted + goal + newsletter w Firestore
- [x] Pojawia się tylko raz dla nowych userów

---

## ⏳ Do zrobienia (priorytety)

1. **Panel admina** – statystyki userów, liczba analiz, MRR
2. **Wysyłka emailów** – potwierdzenie rejestracji, powiadomienie o limicie, newsletter
3. **Poprawa UI/UX** – dopracowanie dark mode w komponentach, responsywność mobile
4. **Marketing** – LinkedIn content (masz plan 12 postów), outreach do HR/rekruterów
5. **Stripe produkcyjny** – po weryfikacji konta zamień klucze testowe na live
6. **Webhook Stripe** – zapisywanie isPro=true w Firestore po płatności (TODO w stripe.js)

---

## 💳 Stripe – ważne szczegóły

- **Price ID (test):** `price_1T5qzwA0VPRlBFsOaFipIxCV`
- **Tryb:** testowy (sk_test_...)
- **Metody płatności:** tylko karta (BLIK i P24 nie obsługują subskrypcji)
- **Karta testowa:** `4242 4242 4242 4242` | data: `12/30` | CVC: `123`
- **TODO:** Po weryfikacji konta Stripe → nowy produkt w Live mode → nowe Price ID → zamień klucze

### Webhook (do dokończenia)
W `backend/routes/stripe.js` jest TODO dla webhooka który powinien:
- Po `checkout.session.completed` → zapisać `isPro: true` w `users/{userId}` w Firestore
- Po `customer.subscription.deleted` → zapisać `isPro: false`

---

## 🔗 Linki afiliacyjne

Plik: `frontend/src/utils/affiliateLinks.js`

```js
const AFFILIATE_IDS = {
  udemy:    'YOUR_UDEMY_ID',    // ← podmienić po akceptacji
  coursera: 'YOUR_COURSERA_ID', // ← podmienić po akceptacji
}
```

- Udemy: zarejestrowany na betelo.pl, czeka na akceptację
- Coursera: do rejestracji

---

## 🔒 Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📦 Jak deployować

### Frontend (Netlify – auto)
```bash
cd /Users/ratay/betelo-labs/jobtrack
git add .
git commit -m "v1.X.X – opis zmian"
git push
# Netlify builduje automatycznie
```

### Backend (Railway – auto z GitHub)
```bash
# Railway builduje automatycznie po git push
# Po dodaniu nowej zależności:
cd /Users/ratay/betelo-labs/jobtrack/backend
npm install
git add package-lock.json
git commit -m "Update deps"
git push
```

### Aktualizacja wersji (obowiązkowo przy każdym deploy!)
```bash
# Edytuj ręcznie:
# frontend/src/version.js
export const VERSION = '1.X.X'
export const BUILD_DATE = 'YYYY-MM-DD'
export const CHANGELOG = 'Opis zmian'
```

### Częsty problem: netlify.toml
Po każdym `npm run build` plik `netlify.toml` musi być w `dist/`:
```bash
cp frontend/netlify.toml frontend/dist/netlify.toml
```
Netlify robi to automatycznie przy auto-deploy z GitHub.

---

## 📣 Marketing – plan

### Kanały
- LinkedIn organic (masz plan 12 postów na 4 tygodnie)
- Outreach do 20-30 rekruterów/HR (masz szablony wiadomości)
- Grupy FB: Szukam pracy IT, Praca zdalna Polska, HR Polska
- Bootcampy i biura karier uczelni (B2B)

### KPI (90 dni)
| Okres | Zarejestrowani | Płatni | MRR |
|-------|---------------|--------|-----|
| Tydzień 1-2 | 10 beta | 0 | 0 zł |
| Miesiąc 1 | 100 | 5 | 245 zł |
| Miesiąc 2 | 300 | 20 | 980 zł |
| Miesiąc 3 | 1000 | 60 | 2 940 zł |

### Kod promocyjny dla pierwszych userów
`BETA50` – 50% zniżki na 3 miesiące (do skonfigurowania w Stripe → Coupons)

---

## 🐛 Znane problemy / gotchas

1. **version.js** – musi być dodany ręcznie do git i aktualizowany przed każdym deploy
2. **netlify.toml** – przy ręcznym deploy drag&drop musi być w folderze `dist/`
3. **Firebase Admin SDK** – zablokowany przez politykę organizacji, używamy client SDK
4. **isPro** – webhook Stripe nie zapisuje jeszcze isPro w Firestore (TODO)
5. **Onboarding** – można zresetować usuwając `onboardingCompleted` z Firestore

---

*Ostatnia aktualizacja: 2026-02-28 | Wersja: 1.8.0*
