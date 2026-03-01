import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

const GOALS = [
  { value: 'new_job',    label: '🔍 Szukam nowej pracy', desc: 'Chcę zmienić pracodawcę' },
  { value: 'promotion',  label: '📈 Chcę awansować', desc: 'Rozwijam się w obecnej firmie' },
  { value: 'first_job',  label: '🎓 Szukam pierwszej pracy', desc: 'Zaczynam karierę' },
  { value: 'return',     label: '🔄 Wracam po przerwie', desc: 'Byłem/am na urlopie, przerwie' },
  { value: 'freelance',  label: '💼 Przechodzę na freelance', desc: 'Chcę pracować na własny rachunek' },
  { value: 'relocation', label: '✈️ Zmieniam branżę', desc: 'Szukam pracy w nowej dziedzinie' },
]

export default function OnboardingWizard({ onComplete }) {
  const user = useAuth()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [saving, setSaving] = useState(false)

  const name = user?.displayName?.split(' ')[0] || 'tam'

  async function handleComplete() {
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        onboardingCompleted: true,
        goal,
        newsletter,
        createdAt: new Date(),
      }, { merge: true })
      onComplete()
    } catch(e) {
      console.error(e)
      onComplete() // fail open
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'}}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{backgroundColor: 'var(--bg-card)'}}>

        {/* Progress bar */}
        <div className="h-1 w-full" style={{backgroundColor: 'var(--border)'}}>
          <div className="h-1 bg-green-500 transition-all duration-500"
            style={{width: `${(step / 3) * 100}%`}} />
        </div>

        <div className="p-8">

          {/* ── STEP 1 – Cel zawodowy ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="font-display text-2xl font-black mb-1" style={{color: 'var(--text-primary)'}}>
                Cześć, {name}!
              </h2>
              <p className="text-sm mb-6" style={{color: 'var(--text-secondary)'}}>
                Powiedz nam co Cię tu sprowadziło – dostosujemy JobTrack do Twoich potrzeb.
              </p>

              <div className="grid grid-cols-1 gap-2 mb-6">
                {GOALS.map(g => (
                  <button key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all border ${
                      goal === g.value
                        ? 'border-green-500 bg-green-500/10'
                        : 'hover:border-green-300'
                    }`}
                    style={{borderColor: goal === g.value ? '#22c55e' : 'var(--border)'}}>
                    <span className="text-xl">{g.label.split(' ')[0]}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>
                        {g.label.substring(g.label.indexOf(' ') + 1)}
                      </p>
                      <p className="text-xs" style={{color: 'var(--text-muted)'}}>{g.desc}</p>
                    </div>
                    {goal === g.value && (
                      <span className="ml-auto text-green-500 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!goal}
                className="btn-primary w-full justify-center py-3">
                Dalej →
              </button>
            </div>
          )}

          {/* ── STEP 2 – Newsletter ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="font-display text-2xl font-black mb-1" style={{color: 'var(--text-primary)'}}>
                Prawie gotowe!
              </h2>
              <p className="text-sm mb-6" style={{color: 'var(--text-secondary)'}}>
                Chcesz być na bieżąco z nowymi funkcjami i poradami o szukaniu pracy?
              </p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setNewsletter(true)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${newsletter ? 'border-green-500 bg-green-500/10' : ''}`}
                  style={{borderColor: newsletter ? '#22c55e' : 'var(--border)'}}>
                  <span className="text-2xl">📬</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>Tak, chcę powiadomienia</p>
                    <p className="text-xs" style={{color: 'var(--text-muted)'}}>Nowe funkcje, porady, oferty. Max 1 email/tydzień.</p>
                  </div>
                  {newsletter && <span className="text-green-500 font-bold">✓</span>}
                </button>

                <button
                  onClick={() => setNewsletter(false)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${!newsletter ? 'border-green-500 bg-green-500/10' : ''}`}
                  style={{borderColor: !newsletter ? '#22c55e' : 'var(--border)'}}>
                  <span className="text-2xl">🔕</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>Nie, dziękuję</p>
                    <p className="text-xs" style={{color: 'var(--text-muted)'}}>Tylko powiadomienia o koncie.</p>
                  </div>
                  {!newsletter && <span className="text-green-500 font-bold">✓</span>}
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost px-4 py-3">← Wróć</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 justify-center py-3">Dalej →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 – Gotowe ── */}
          {step === 3 && (
            <div className="animate-fade-in text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-display text-2xl font-black mb-2" style={{color: 'var(--text-primary)'}}>
                Gotowe, {name}!
              </h2>
              <p className="text-sm mb-8" style={{color: 'var(--text-secondary)'}}>
                JobTrack jest skonfigurowany pod Twój cel. Masz <strong className="text-green-600">3 darmowe analizy</strong> na start – wykorzystaj je dobrze!
              </p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: '📊', label: 'Analiza CV', desc: 'Sprawdź dopasowanie' },
                  { icon: '✂️', label: 'Dostosuj CV', desc: 'Pod konkretną ofertę' },
                  { icon: '🗺️', label: 'Mapa kariery', desc: 'Plan rozwoju' },
                ].map(f => (
                  <div key={f.label} className="rounded-xl p-3 text-center"
                    style={{backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)'}}>
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <p className="text-xs font-bold" style={{color: 'var(--text-primary)'}}>{f.label}</p>
                    <p className="text-xs" style={{color: 'var(--text-muted)'}}>{f.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleComplete}
                disabled={saving}
                className="btn-primary w-full justify-center py-3.5 text-base">
                {saving ? '⏳ Zapisuję...' : '🚀 Zacznij używać JobTrack'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
