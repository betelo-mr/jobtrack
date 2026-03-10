import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const ADMIN_UID = 'hpvca806XRWF1jignayfDN93eMi1'

export function isAdmin(user) {
  return user?.uid === ADMIN_UID
}

function StatCard({ icon, label, value, sub, color = 'green' }) {
  return (
    <div className="rounded-2xl p-5" style={{backgroundColor:'var(--bg-card)', border:'1px solid var(--border)'}}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm font-medium" style={{color:'var(--text-muted)'}}>{label}</p>
      </div>
      <p className={`text-3xl font-black font-display text-${color}-600`}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>{sub}</p>}
    </div>
  )
}

export default function AdminPanel({ user }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('createdAt')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isAdmin(user)) return
    loadUsers()
  }, [user])

  async function loadUsers() {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'users'))
      const data = []
      for (const doc of snap.docs) {
        const d = doc.data()
        // Pobierz usage
        const usageSnap = await getDocs(collection(db, 'users', doc.id, 'usage'))
        let totalAnalyses = 0
        let todayAnalyses = 0
        const today = new Date().toISOString().slice(0, 10)
        usageSnap.docs.forEach(u => {
          const count = u.data().count || 0
          totalAnalyses += count
          if (u.id === `day-${today}`) todayAnalyses = count
        })
        data.push({
          uid: doc.id,
          email: d.email || '—',
          isPro: d.isPro || false,
          createdAt: d.createdAt?.toDate?.() || null,
          proActivatedAt: d.proActivatedAt || null,
          goal: d.goal || '—',
          newsletter: d.newsletter || false,
          totalAnalyses,
          todayAnalyses,
          isAnomaly: todayAnalyses >= 20,
        })
      }
      setUsers(data)
    } catch(e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (!isAdmin(user)) return null

  const proUsers = users.filter(u => u.isPro)
  const freeUsers = users.filter(u => !u.isPro)
  const mrr = proUsers.length * 49
  const anomalies = users.filter(u => u.isAnomaly)
  const totalAnalyses = users.reduce((sum, u) => sum + u.totalAnalyses, 0)

  const filtered = users
    .filter(u => {
      if (filter === 'pro') return u.isPro
      if (filter === 'free') return !u.isPro
      if (filter === 'anomaly') return u.isAnomaly
      return true
    })
    .sort((a, b) => {
      if (sort === 'createdAt') return (b.createdAt || 0) - (a.createdAt || 0)
      if (sort === 'analyses') return b.totalAnalyses - a.totalAnalyses
      if (sort === 'today') return b.todayAnalyses - a.todayAnalyses
      return 0
    })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-2xl" style={{color:'var(--text-primary)'}}>Panel Admina</h1>
          <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>Tylko dla Ciebie 👁️</p>
        </div>
        <button onClick={loadUsers}
          className="btn-ghost text-sm">
          🔄 Odśwież
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon="👥" label="Wszyscy userzy" value={users.length} />
        <StatCard icon="⚡" label="Pro" value={proUsers.length} color="green" sub={`${freeUsers.length} Free`} />
        <StatCard icon="💰" label="MRR" value={`${mrr} zł`} color="green" sub="miesięczny przychód" />
        <StatCard icon="🤖" label="Łącznie analiz" value={totalAnalyses} color="blue" />
        <StatCard icon="🚨" label="Anomalie" value={anomalies.length} color="red" sub="20+ analiz/dzień" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: `Wszyscy (${users.length})` },
          { key: 'pro', label: `Pro (${proUsers.length})` },
          { key: 'free', label: `Free (${freeUsers.length})` },
          { key: 'anomaly', label: `🚨 Anomalie (${anomalies.length})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              filter === f.key
                ? 'bg-green-600 text-white'
                : 'hover:opacity-70'
            }`}
            style={filter !== f.key ? {backgroundColor:'var(--bg-input)', color:'var(--text-secondary)', border:'1px solid var(--border)'} : {}}>
            {f.label}
          </button>
        ))}
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="ml-auto text-xs px-3 py-1.5 rounded-full"
          style={{backgroundColor:'var(--bg-input)', color:'var(--text-secondary)', border:'1px solid var(--border)'}}>
          <option value="createdAt">↓ Data rejestracji</option>
          <option value="analyses">↓ Łącznie analiz</option>
          <option value="today">↓ Analizy dziś</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{border:'1px solid var(--border)'}}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{backgroundColor:'var(--bg-input)'}}>
                <th className="text-left px-4 py-3 font-semibold" style={{color:'var(--text-muted)'}}>User</th>
                <th className="text-left px-4 py-3 font-semibold" style={{color:'var(--text-muted)'}}>Plan</th>
                <th className="text-left px-4 py-3 font-semibold" style={{color:'var(--text-muted)'}}>Cel</th>
                <th className="text-right px-4 py-3 font-semibold" style={{color:'var(--text-muted)'}}>Analizy łącznie</th>
                <th className="text-right px-4 py-3 font-semibold" style={{color:'var(--text-muted)'}}>Dziś</th>
                <th className="text-left px-4 py-3 font-semibold" style={{color:'var(--text-muted)'}}>Rejestracja</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.uid}
                  style={{
                    backgroundColor: u.isAnomaly ? 'rgba(239,68,68,0.05)' : i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-main)',
                    borderTop: '1px solid var(--border)'
                  }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {u.isAnomaly && <span title="Anomalia">🚨</span>}
                      <div>
                        <p className="font-medium" style={{color:'var(--text-primary)'}}>{u.email}</p>
                        <p className="text-xs font-mono" style={{color:'var(--text-muted)'}}>{u.uid.slice(0,12)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      u.isPro ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {u.isPro ? '⚡ PRO' : 'Free'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{color:'var(--text-secondary)'}}>{u.goal}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold" style={{color:'var(--text-primary)'}}>{u.totalAnalyses}</td>
                  <td className="px-4 py-3 text-right font-mono" style={{color: u.isAnomaly ? '#ef4444' : 'var(--text-secondary)'}}>
                    {u.todayAnalyses}
                    {u.isAnomaly && ' ⚠️'}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{color:'var(--text-muted)'}}>
                    {u.createdAt ? u.createdAt.toLocaleDateString('pl-PL') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{color:'var(--text-muted)'}}>Brak userów</div>
          )}
        </div>
      )}
    </div>
  )
}
