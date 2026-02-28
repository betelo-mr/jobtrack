import { useState } from 'react'

const FEATURES = [
  {
    icon: '📊',
    title: 'Analiza CV pod ofertę',
    desc: 'Wklej ogłoszenie i CV – JobTrack wskaże brakujące słowa kluczowe, oceni dopasowanie i powie co zmienić. Wynik w 30 sekund.',
    color: 'from-blue-50 to-blue-100/50',
    accent: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600',
  },
  {
    icon: '✂️',
    title: 'Automatyczne dostosowanie CV',
    desc: 'AI przepisuje Twoje CV używając języka konkretnej oferty. Bez wymyślania – tylko Twoje doświadczenie, lepiej opowiedziane.',
    color: 'from-purple-50 to-purple-100/50',
    accent: 'text-purple-600',
    badge: 'bg-purple-50 text-purple-600',
  },
  {
    icon: '🗺️',
    title: 'Mapa umiejętności',
    desc: 'Powiedz dokąd chcesz dotrzeć zawodowo. AI przeanalizuje Twoje CV i stworzy spersonalizowany plan rozwoju z konkretnymi kursami.',
    color: 'from-green-50 to-green-100/50',
    accent: 'text-green-600',
    badge: 'bg-green-50 text-green-600',
  },
  {
    icon: '📋',
    title: 'Tracker aplikacji',
    desc: 'Jeden panel do śledzenia wszystkich aplikacji. Status, notatki, daty – nigdy nie zgub wątku w procesie rekrutacji.',
    color: 'from-yellow-50 to-yellow-100/50',
    accent: 'text-yellow-600',
    badge: 'bg-yellow-50 text-yellow-600',
  },
]

const FAQS = [
  {
    q: 'Czy AI wymyśla informacje w moim CV?',
    a: 'Nie. JobTrack przepisuje tylko to co już masz w CV – zmienia język i akcenty, nie dodaje fałszywych doświadczeń. Twoje CV pozostaje w 100% prawdziwe.',
  },
  {
    q: 'Czy moje CV jest bezpieczne?',
    a: 'Twoje dane są przesyłane bezpośrednio do analizy i nie są przechowywane na naszych serwerach dłużej niż czas analizy. Używamy Firebase do bezpiecznego przechowywania Twoich aplikacji.',
  },
  {
    q: 'Jak działa darmowy plan?',
    a: 'Możesz wykonać 3 analizy miesięcznie za darmo – bez podawania karty kredytowej. Jeśli chcesz więcej, przejdź na plan Pro.',
  },
  {
    q: 'Czy mogę wgrać CV w PDF?',
    a: 'Tak. Obsługujemy pliki PDF do 5MB. Możesz też wkleić treść CV bezpośrednio jako tekst.',
  },
  {
    q: 'Jak anulować subskrypcję?',
    a: 'W każdej chwili jednym kliknięciem w ustawieniach konta. Bez ukrytych opłat, bez okresu wypowiedzenia.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Kasia W.',
    role: 'Junior Frontend Developer',
    text: 'Wysyłałam CV miesiącami bez odpowiedzi. JobTrack wskazał 8 brakujących słów kluczowych. W tydzień dostałam 3 zaproszenia na rozmowy.',
    avatar: 'KW',
    color: 'bg-blue-500',
  },
  {
    name: 'Marek T.',
    role: 'Product Manager',
    text: 'Funkcja dostosowania CV to game changer. Zamiast pisać nowe CV od zera, w 2 minuty mam wersję skrojoną pod konkretną ofertę.',
    avatar: 'MT',
    color: 'bg-purple-500',
  },
  {
    name: 'Ania K.',
    role: 'Data Analyst',
    text: 'Mapa umiejętności pokazała mi dokładnie czego mi brakuje do roli Senior DA. Plan był tak konkretny, że zaczęłam kurs jeszcze tego samego dnia.',
    avatar: 'AK',
    color: 'bg-green-500',
  },
]

export default function LandingPage({ onLogin }) {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <span className="font-display text-xl font-black text-green-600">JobTrack</span>
            <span className="text-xs text-gray-400 ml-2 font-light hidden sm:inline">AI Career Assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">
              Zaloguj się
            </button>
            <button onClick={onLogin} className="btn-primary text-sm">
              Zacznij za darmo →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-green-100 via-blue-50 to-purple-100 rounded-full opacity-40 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-xs font-semibold text-green-700 mb-6">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            AI Career Assistant · Beta
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-6">
            Twoje CV wreszcie<br />
            <span className="text-green-600">mówi językiem pracodawcy</span>
          </h1>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            JobTrack analizuje Twoje CV pod konkretną ofertę, automatycznie je przepisuje i buduje mapę umiejętności. Więcej rozmów kwalifikacyjnych, mniej odrzuceń.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={onLogin}
              className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto justify-center">
              Zacznij za darmo – 3 analizy/mies. 🚀
            </button>
            <button onClick={onLogin}
              className="btn-ghost text-base px-8 py-3.5 w-full sm:w-auto justify-center">
              Zobacz demo →
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Bez karty kredytowej · Rejestracja w 30 sekund</p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '3×', label: 'więcej odpowiedzi od rekruterów' },
              { value: '30s', label: 'czas analizy CV' },
              { value: '100%', label: 'prawdziwe dane – AI nie wymyśla' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-4xl font-black text-green-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-gray-900 mb-4">
              Wszystko czego potrzebujesz<br />żeby dostać tę pracę
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-xl mx-auto">
              Cztery narzędzia w jednym miejscu. Każde zaoszczędza godziny pracy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className={`card p-7 bg-gradient-to-br ${f.color} border-0 hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
                <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className={`font-display text-lg font-bold mb-2 ${f.accent}`}>{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-gray-900 mb-4">Jak to działa?</h2>
            <p className="text-lg text-gray-500 font-light">Trzy kroki dzielą Cię od lepszego CV</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Wgraj CV', desc: 'Wklej tekst lub wgraj PDF. Obsługujemy wszystkie formaty.' },
              { step: '02', title: 'Wklej ogłoszenie', desc: 'Skopiuj treść oferty pracy z dowolnego portalu.' },
              { step: '03', title: 'Dostań wyniki', desc: 'JobTrack analizuje dopasowanie i przepisuje CV w 30 sekund.' },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                {i < 2 && <div className="hidden sm:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-green-300 to-transparent -translate-x-4" />}
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center font-display font-black text-white text-xl mx-auto mb-5 shadow-lg shadow-green-200">
                  {s.step}
                </div>
                <h3 className="font-display font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-gray-900 mb-4">Co mówią użytkownicy</h2>
            <p className="text-lg text-gray-500 font-light">Prawdziwe wyniki, prawdziwi ludzie</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-display font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <div className="text-2xl text-green-400 font-display font-black mb-2">"</div>
                <p className="text-sm text-gray-600 leading-relaxed">{t.text}</p>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-gray-900 mb-4">Prosty cennik</h2>
            <p className="text-lg text-gray-500 font-light">Zacznij za darmo, przejdź na Pro kiedy będziesz gotowy</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* FREE */}
            <div className="card p-8">
              <p className="text-xs font-display font-bold text-gray-400 uppercase tracking-widest mb-3">Free</p>
              <p className="font-display text-5xl font-black text-gray-900 mb-1">0 zł</p>
              <p className="text-sm text-gray-400 mb-8">na zawsze</p>
              <div className="space-y-3 mb-8">
                {[
                  '3 analizy CV miesięcznie',
                  '3 dostosowania CV miesięcznie',
                  'Tracker aplikacji',
                  'Mapa umiejętności (1×)',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500 font-bold">✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={onLogin} className="btn-ghost w-full justify-center py-3">
                Zacznij za darmo
              </button>
            </div>

            {/* PRO */}
            <div className="card p-8 border-green-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-display font-bold px-4 py-1 rounded-full">
                Najpopularniejszy
              </div>
              <p className="text-xs font-display font-bold text-green-600 uppercase tracking-widest mb-3">Pro</p>
              <p className="font-display text-5xl font-black text-gray-900 mb-1">49 zł</p>
              <p className="text-sm text-gray-400 mb-8">miesięcznie · anuluj kiedy chcesz</p>
              <div className="space-y-3 mb-8">
                {[
                  'Nielimitowane analizy CV',
                  'Nielimitowane dostosowania CV',
                  'Tracker aplikacji',
                  'Nielimitowana mapa umiejętności',
                  'Priorytetowe wsparcie',
                  'Nowe funkcje jako pierwszy',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500 font-bold">✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={onLogin} className="btn-primary w-full justify-center py-3">
                Wypróbuj Pro →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-gray-900 mb-4">Często zadawane pytania</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-800 text-sm pr-4">{faq.q}</span>
                  <span className={`text-green-600 font-bold text-lg transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-green-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-500 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-700 rounded-full opacity-40 blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="font-display text-4xl font-black text-white mb-4">
            Gotowy na więcej rozmów kwalifikacyjnych?
          </h2>
          <p className="text-green-100 text-lg font-light mb-8">
            Dołącz do kandydatów którzy już używają AI do szukania pracy.
          </p>
          <button onClick={onLogin}
            className="bg-white text-green-600 px-10 py-4 rounded-xl font-display font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            Zacznij za darmo →
          </button>
          <p className="text-green-200 text-xs mt-4">Bez karty kredytowej · Rejestracja w 30 sekund</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display font-black text-green-600">JobTrack</span>
            <span className="text-xs text-gray-400 ml-2">© 2026 · JobTrack AI</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Polityka prywatności</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Regulamin</a>
            <a href="mailto:hello@jobtrack.pl" className="hover:text-gray-600 transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
