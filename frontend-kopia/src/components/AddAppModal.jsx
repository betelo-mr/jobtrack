import { useState } from 'react'

export default function AddAppModal({ onClose, onSave }) {
  const [form, setForm] = useState({ company:'', position:'', location:'', portal:'LinkedIn', status:'sent', notes:'' })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    if (!form.company.trim() || !form.position.trim()) return
    setLoading(true)
    await onSave(form)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if(e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 animate-fade-in">
        <h3 className="font-display font-bold text-lg text-gray-800 mb-5">➕ Dodaj aplikację</h3>

        <div className="space-y-3">
          {[
            { key:'company', label:'Nazwa firmy', placeholder:'np. Google, Allegro...' },
            { key:'position', label:'Stanowisko', placeholder:'np. Frontend Developer...' },
            { key:'location', label:'Lokalizacja', placeholder:'Warszawa / Zdalnie...' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-display text-gray-400 uppercase tracking-wide mb-1">{f.label}</label>
              <input className="input" type="text" placeholder={f.placeholder}
                value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display text-gray-400 uppercase tracking-wide mb-1">Portal</label>
              <select className="input" value={form.portal} onChange={e => set('portal', e.target.value)}>
                {['LinkedIn','Pracuj.pl','NoFluffJobs','JustJoin.it','Strona firmy','Inne'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-display text-gray-400 uppercase tracking-wide mb-1">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="sent">Wysłane</option>
                <option value="viewed">Wyświetlono</option>
                <option value="interview">Rozmowa</option>
                <option value="offer">Oferta</option>
                <option value="rejected">Odrzucono</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-display text-gray-400 uppercase tracking-wide mb-1">Notatki (opcjonalnie)</label>
            <textarea className="input resize-none h-20" placeholder="Kontakt do rekrutera, wynagrodzenie, uwagi..."
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="btn-ghost">Anuluj</button>
          <button onClick={handleSave} disabled={loading || !form.company || !form.position} className="btn-primary">
            {loading ? 'Zapisuję...' : 'Zapisz aplikację'}
          </button>
        </div>
      </div>
    </div>
  )
}
