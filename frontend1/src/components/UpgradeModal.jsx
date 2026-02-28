import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function UpgradeModal({ onClose }) {
  const user = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpgrade() {
    if (!user) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, userEmail: user.email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch(e) {
      setError('Błąd: ' + e.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl">✕</button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-green-200">
            ⚡
          </div>
          <h2 className="font-display text-2xl font-black text-gray-900">Upgrade do Pro</h2>
          <p className="text-gray-400 text-sm mt-1">Odblokuj pełne możliwości JobTrack</p>
        </div>

        {/* Features */}
        <div className="space-y-2.5 mb-6">
          {[
            'Nielimitowane analizy CV',
            'Nielimitowane dostosowania CV',
            'Nielimitowana mapa umiejętności',
            'Priorytetowe wsparcie',
            'Nowe funkcje jako pierwszy',
          ].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-gray-600">{f}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="bg-green-50 rounded-xl p-4 text-center mb-6">
          <p className="font-display text-4xl font-black text-green-600">49 zł</p>
          <p className="text-xs text-gray-400 mt-1">miesięcznie · anuluj kiedy chcesz</p>
        </div>

        {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

        {/* CTA */}
        <button onClick={handleUpgrade} disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
          {loading ? <><span className="animate-spin inline-block">⏳</span> Przekierowuję...</> : '⚡ Przejdź na Pro – 49 zł/mies.'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Płatność obsługiwana przez Stripe · BLIK, karta, Przelewy24
        </p>
      </div>
    </div>
  )
}
