export default function Analytics({ applications }) {
  // Build weekly data
  const weeks = Array(8).fill(0)
  const now = Date.now()
  applications.forEach(a => {
    const ts = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0)
    const diff = Math.floor((now - ts) / (7*24*60*60*1000))
    if (diff >= 0 && diff < 8) weeks[7-diff]++
  })
  const maxWeek = Math.max(...weeks, 1)

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Weekly chart */}
          <div>
            <h3 className="font-display font-bold text-gray-800 mb-3">Aplikacje w czasie (ostatnie 8 tygodni)</h3>
            <div className="card p-5">
              <div className="flex items-end gap-2 h-36 border-b border-gray-100 pb-1">
                {weeks.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-xs text-green-600 font-semibold">{v > 0 ? v : ''}</span>
                    <div className={`w-full rounded-t-lg transition-all duration-700 ${i===7 ? 'bg-green-600 shadow-lg shadow-green-200' : 'bg-green-100'}`}
                      style={{ height: `${Math.max(v/maxWeek*100, 4)}%` }} />
                    <span className="text-xs text-gray-300 mt-1">T.{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Response rate by portal */}
          <div>
            <h3 className="font-display font-bold text-gray-800 mb-3">Wskaźnik odpowiedzi wg portalu</h3>
            <div className="card p-5 space-y-3">
              {[
                { name:'LinkedIn', rate:32, color:'bg-blue-400' },
                { name:'JustJoin.it', rate:24, color:'bg-green-500' },
                { name:'NoFluffJobs', rate:20, color:'bg-yellow-400' },
                { name:'Pracuj.pl', rate:11, color:'bg-gray-300' },
              ].map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-24 shrink-0">{p.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${p.color}`} style={{ width:`${p.rate}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-8 text-right">{p.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div>
          <h3 className="font-display font-bold text-gray-800 mb-3">Kluczowe insighty</h3>
          <div className="space-y-3">
            {[
              { icon:'🎯', title:'Najlepszy portal', text:'LinkedIn daje 32% wskaźnik odpowiedzi – 3x wyżej niż Pracuj.pl.' },
              { icon:'⏰', title:'Najlepszy czas', text:'Aplikacje wt–śr rano mają 2x wyższy wskaźnik odpowiedzi.' },
              { icon:'📝', title:'Optymalizuj CV', text:'CV dostosowane przez AI mają 3x lepszy wynik aplikacji.' },
              { icon:'⚡', title:'Szybkość ma znaczenie', text:'Aplikacje w ciągu 24h od publikacji mają 60% wyższy wskaźnik.' },
            ].map(i => (
              <div key={i.title} className="card p-4 flex gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-lg shrink-0">{i.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{i.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{i.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
