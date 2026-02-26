const STATUS_LABELS = { sent:'Wysłane', viewed:'Wyświetlono', interview:'Rozmowa', offer:'Oferta! 🎉', rejected:'Odrzucono' }
const STATUS_COLORS = { sent:'status-sent', viewed:'status-viewed', interview:'status-interview', offer:'status-offer', rejected:'status-rejected' }

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date())
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (diff === 0) return 'Dziś'
  if (diff === 1) return 'Wczoraj'
  if (diff < 7) return `${diff} dni temu`
  return d.toLocaleDateString('pl-PL')
}

function randomColor(str) {
  const colors = ['text-blue-500','text-green-600','text-purple-500','text-yellow-500','text-red-400','text-cyan-500']
  let h = 0
  for (const c of (str||'')) h = c.charCodeAt(0) + ((h<<5)-h)
  return colors[Math.abs(h) % colors.length]
}

export default function Dashboard({ applications, onAdd, setPage }) {
  const total = applications.length
  const interviews = applications.filter(a => a.status === 'interview').length
  const offers = applications.filter(a => a.status === 'offer').length
  const pending = applications.filter(a => ['sent','viewed'].includes(a.status)).length
  const rate = total > 0 ? Math.round(interviews/total*100) : 0

  const counts = { sent:0, viewed:0, interview:0, offer:0, rejected:0 }
  applications.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++ })

  const recent = applications.slice(0, 5)

  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Wysłane CV', value: total, color: 'text-blue-500', sub: `Rozmowy: ${rate}%` },
          { label: 'Rozmowy', value: interviews, color: 'text-purple-500', sub: `Wskaźnik: ${rate}%` },
          { label: 'Oczekujące', value: pending, color: 'text-yellow-500', sub: 'Aktywne' },
          { label: 'Oferty', value: offers, color: 'text-green-600', sub: offers > 0 ? '🎉 Gratulacje!' : 'Czekają' },
        ].map(s => (
          <div key={s.label} className="card p-5 hover:border-green-200 transition-colors">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`font-display text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Recent applications */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-gray-800">Ostatnie aplikacje</h3>
            <button onClick={() => setPage('tracker')} className="text-xs text-green-600 hover:underline">
              Zobacz wszystkie →
            </button>
          </div>
          <div className="card p-1">
            {recent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-400 text-sm mb-4">Brak aplikacji. Zacznij już teraz!</p>
                <button onClick={onAdd} className="btn-primary">+ Dodaj pierwszą aplikację</button>
              </div>
            ) : recent.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className={`w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-display font-bold text-sm ${randomColor(a.company)}`}>
                  {a.company.substring(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.position}</p>
                  <p className="text-xs text-gray-400">{a.company} · {formatDate(a.createdAt)}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[a.status]}`}>
                  {STATUS_LABELS[a.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div>
          <h3 className="font-display font-bold text-gray-800 mb-3">Lejek aplikacji</h3>
          <div className="card p-5 space-y-3">
            {[
              { key:'sent', label:'Wysłane', color:'bg-blue-400' },
              { key:'viewed', label:'Wyświetlono', color:'bg-yellow-400' },
              { key:'interview', label:'Rozmowa', color:'bg-purple-400' },
              { key:'offer', label:'Oferta', color:'bg-green-500' },
              { key:'rejected', label:'Odrzucono', color:'bg-red-400' },
            ].map(f => (
              <div key={f.key} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-20 shrink-0">{f.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${f.color} transition-all duration-700`}
                    style={{ width: total > 0 ? `${Math.round(counts[f.key]/total*100)}%` : '0%' }} />
                </div>
                <span className="text-xs font-semibold text-gray-500 w-4 text-right">{counts[f.key]}</span>
              </div>
            ))}
          </div>

          {/* Activity */}
          <h3 className="font-display font-bold text-gray-800 mb-3 mt-5">Aktywność</h3>
          <div className="card p-4 space-y-3">
            {recent.slice(0,3).length === 0
              ? <p className="text-xs text-gray-400">Brak aktywności</p>
              : recent.slice(0,3).map(a => (
                <div key={a.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600"><span className="font-semibold">{a.company}</span> – {STATUS_LABELS[a.status]}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.createdAt)}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
