import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'tracker',   icon: '📋', label: 'Moje aplikacje' },
  { id: 'ai',        icon: '🤖', label: 'AI Asystent' },
  { id: 'jobs',      icon: '🔍', label: 'Oferty pracy' },
  { id: 'analytics', icon: '📈', label: 'Analityka' },
]

export default function Sidebar({ user, page, setPage, appCount }) {
  const name = user?.displayName || user?.email?.split('@')[0] || '?'

  return (
    <aside className="fixed top-0 left-0 w-60 h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm z-50">
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="font-display text-xl font-black text-green-600 tracking-tight">JobTrack</h1>
        <p className="text-xs text-gray-400 font-light mt-0.5">Career Assistant</p>
      </div>

      <nav className="flex-1 py-3">
        {NAV.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all border-l-2
              ${page === item.id
                ? 'text-green-600 bg-green-50 border-green-600'
                : 'text-gray-400 border-transparent hover:text-gray-700 hover:bg-gray-50'}`}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'tracker' && appCount > 0 && (
              <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                {appCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {user?.photoURL
            ? <img src={user.photoURL} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold font-display">
                {name.charAt(0).toUpperCase()}
              </div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={() => signOut(auth)}
            title="Wyloguj"
            className="text-gray-300 hover:text-red-400 transition-colors text-sm p-1 rounded">
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}
