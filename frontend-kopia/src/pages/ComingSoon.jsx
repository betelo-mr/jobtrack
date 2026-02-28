import { useState } from 'react'

export default function ComingSoon({ feature }) {
  const CONFIGS = {
    jobs: {
      icon: '🔍',
      title: 'Oferty pracy',
      subtitle: 'Agregator ogłoszeń z LinkedIn, Pracuj.pl, NoFluffJobs i JustJoin.it',
      description: 'Pracujemy nad integracją z największymi portalami pracy w Polsce. Wkrótce będziesz mógł przeglądać tysiące ofert i aplikować jednym kliknięciem – bez opuszczania JobTrack.',
      features: [
        '🔗 Oferty z 5+ portali w jednym miejscu',
        '🤖 AI dopasowuje oferty do Twojego CV',
        '⚡ Aplikuj jednym kliknięciem',
        '🔔 Powiadomienia o nowych ofertach',
      ],
      color: 'from-blue-50 to-blue-100/30',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      btn: 'bg-blue-600 hover:bg-blue-700',
    },
    analytics: {
      icon: '📈',
      title: 'Analityka',
      subtitle: 'Zaawansowane statystyki Twojego procesu rekrutacji',
      description: 'Szczegółowe raporty które pokazują co działa, a co nie. Porównuj swoje wyniki z innymi kandydatami i optymalizuj strategię szukania pracy.',
      features: [
        '📊 Wskaźnik odpowiedzi wg portalu',
        '⏱️ Średni czas odpowiedzi rekruterów',
        '🎯 Analiza słów kluczowych które działają',
        '📅 Prognoza – kiedy spodziewać się ofert',
      ],
      color: 'from-purple-50 to-purple-100/30',
      accent: 'text-purple-600',
      border: 'border-purple-200',
      btn: 'bg-purple-600 hover:bg-purple-700',
    },
  }

  const config = CONFIGS[feature] || CONFIGS.jobs
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleNotify(e) {
    e.preventDefault()
    if (!email) return
    // TODO: zapisz email do bazy
    setSent(true)
    setEmail('')
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className={`card p-10 bg-gradient-to-br ${config.color} border ${config.border} text-center`}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-500 mb-6">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
          W przygotowaniu
        </div>

        {/* Icon */}
        <div className="text-6xl mb-5">{config.icon}</div>

        {/* Title */}
        <h2 className="font-display text-3xl font-black text-gray-900 mb-2">{config.title}</h2>
        <p className={`text-sm font-semibold ${config.accent} mb-4`}>{config.subtitle}</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">{config.description}</p>

        {/* Features */}
        <div className="bg-white/70 rounded-2xl p-5 mb-8 text-left space-y-2.5">
          {config.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Notify form */}
        {!sent ? (
          <form onSubmit={handleNotify} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              className="input flex-1 text-sm"
              placeholder="Twój email..."
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" className={`${config.btn} text-white text-sm px-4 py-2 rounded-lg font-semibold transition-colors shrink-0`}>
              Powiadom mnie
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-sm text-green-700 font-semibold max-w-sm mx-auto">
            ✓ Dodano! Powiadomimy Cię jako pierwszego.
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">Bez spamu. Tylko jedna wiadomość gdy funkcja będzie gotowa.</p>
      </div>
    </div>
  )
}
