import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { VERSION, BUILD_DATE } from '../version'
import { useTheme } from '../context/ThemeContext'
import ChangelogModal from './ChangelogModal'

const NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'tracker',   icon: '📋', label: 'Moje aplikacje' },
  { id: 'ai',        icon: '🤖', label: 'AI Asystent' },
  { id: 'jobs',      icon: '🔍', label: 'Oferty pracy', soon: true },
  { id: 'analytics', icon: '📈', label: 'Analityka', soon: true },
]

function VersionBadge() {
  const [showChangelog, setShowChangelog] = useState(false)
  const lastSeen = localStorage.getItem('jobtrack-last-seen-version')
  const hasNew = lastSeen !== VERSION

  function handleClick() {
    localStorage.setItem('jobtrack-last-seen-version', VERSION)
    setShowChangelog(true)
  }

  return (
    <>
      <div className="px-4 pb-3 pt-1 flex items-center justify-between">
        <button onClick={handleClick}
          className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
          <p className="text-xs font-mono" style={{color:'var(--text-muted)'}}>v{VERSION} · {BUILD_DATE}</p>
          {hasNew && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
        </button>
        <ThemeToggle />
      </div>
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
      style={{background:'var(--bg-input)', border:'1px solid var(--border)'}}
      title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

export default function Sidebar({ user, page, setPage, appCount, isPro }) {
  const name = user?.displayName || user?.email?.split('@')[0] || '?'

  return (
    <aside className="fixed top-0 left-0 w-60 h-screen flex flex-col shadow-sm z-50"
      style={{backgroundColor:'var(--bg-sidebar)', borderRight:'1px solid var(--border)'}}>
      <div className="px-6 py-5" style={{borderBottom:'1px solid var(--border)'}}>
        <h1 className="font-display text-xl font-black text-green-600 tracking-tight">JobTrack</h1>
        <p className="text-xs font-light mt-0.5" style={{color:'var(--text-muted)'}}>Career Assistant</p>
      </div>

      <nav className="flex-1 py-3">
        {NAV.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all border-l-2 ${
              page === item.id
                ? 'text-green-600 bg-green-500/10 border-green-600'
                : 'border-transparent hover:bg-white/5'
            }`}
            style={{color: page === item.id ? '#16a34a' : 'var(--text-secondary)'}}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'tracker' && appCount > 0 && (
              <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                {appCount}
              </span>
            )}
            {item.soon && (
              <span className="ml-auto bg-yellow-50 text-yellow-500 text-xs px-2 py-0.5 rounded-full font-semibold">
                Wkrótce
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4" style={{borderTop:'1px solid var(--border)'}}>
        <div className="flex items-center gap-3">
          {user?.photoURL
            ? <img src={user.photoURL} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold font-display">
                {name.charAt(0).toUpperCase()}
              </div>
          }
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold truncate" style={{color:'var(--text-primary)'}}>{name}</p>
              {isPro && <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">PRO</span>}
            </div>
            <p className="text-xs truncate" style={{color:'var(--text-muted)'}}>{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth)}
            title="Wyloguj"
            className="hover:text-red-400 transition-colors text-sm p-1 rounded"
            style={{color:'var(--text-muted)'}}>
            ↩
          </button>
        </div>
      </div>

      <VersionBadge />
    </aside>
  )
}
