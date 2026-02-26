import { useState } from 'react'

const STATUS_LABELS = { sent:'Wysłane', viewed:'Wyświetlono', interview:'Rozmowa', offer:'Oferta! 🎉', rejected:'Odrzucono' }
const STATUS_COLORS = { sent:'status-sent', viewed:'status-viewed', interview:'status-interview', offer:'status-offer', rejected:'status-rejected' }
const FILTERS = ['all','sent','viewed','interview','offer','rejected']
const FILTER_LABELS = { all:'Wszystkie', sent:'Wysłane', viewed:'Wyświetlono', interview:'Rozmowa', offer:'Oferta', rejected:'Odrzucone' }

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date())
  return d.toLocaleDateString('pl-PL')
}

function randomColor(str) {
  const colors = ['text-blue-500','text-green-600','text-purple-500','text-yellow-500','text-red-400','text-cyan-500']
  let h = 0
  for (const c of (str||'')) h = c.charCodeAt(0) + ((h<<5)-h)
  return colors[Math.abs(h) % colors.length]
}

export default function Tracker({ applications, onAdd, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)

  return (
    <div className="animate-fade-in">
      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all
              ${filter === f ? 'bg-green-600 text-white border-green-600' : 'text-gray-400 border-gray-200 hover:border-green-400 hover:text-green-600'}`}>
            {FILTER_LABELS[f]}
            {f !== 'all' && <span className="ml-1 opacity-60">({applications.filter(a => a.status === f).length})</span>}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-gray-400 font-medium mb-1">
              {filter === 'all' ? 'Brak aplikacji' : 'Brak wyników dla tego filtra'}
            </p>
            <p className="text-sm text-gray-300 mb-4">
              {filter === 'all' ? 'Dodaj pierwszą aplikację!' : 'Spróbuj innego filtra.'}
            </p>
            {filter === 'all' && <button onClick={onAdd} className="btn-primary">+ Dodaj aplikację</button>}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Firma','Stanowisko','Lokalizacja','Portal','Data','Status',''].map(h => (
                  <th key={h} className="text-left text-xs font-display text-gray-300 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center font-display font-bold text-xs ${randomColor(a.company)}`}>
                        {a.company.substring(0,2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{a.company}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium">{a.position}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{a.location || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{a.portal || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[a.status]}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if(confirm('Usunąć?')) onDelete(a.id) }}
                      className="text-gray-200 hover:text-red-400 transition-colors text-sm">
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
