import { useState } from 'react'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const ERROR_MESSAGES = {
  'auth/invalid-email': 'Nieprawidłowy adres email.',
  'auth/user-not-found': 'Nie znaleziono konta.',
  'auth/wrong-password': 'Nieprawidłowe hasło.',
  'auth/email-already-in-use': 'Ten email jest już zarejestrowany.',
  'auth/weak-password': 'Hasło musi mieć co najmniej 6 znaków.',
  'auth/invalid-credential': 'Nieprawidłowy email lub hasło.'
}

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true); setError('')
    try { await signInWithPopup(auth, googleProvider) }
    catch(e) { setError(e.message) }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) { setError('Wypełnij email i hasło.'); return }
    setLoading(true); setError('')
    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name) await updateProfile(cred.user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch(e) {
      setError(ERROR_MESSAGES[e.code] || 'Wystąpił błąd. Spróbuj ponownie.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-50 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="relative bg-white border border-gray-100 rounded-3xl shadow-xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black text-green-600 mb-1">JobTrack</h1>
          <p className="text-gray-400 text-sm font-light">
            {mode === 'login' ? 'Twój inteligentny asystent kariery' : 'Stwórz darmowe konto'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 text-sm font-medium hover:border-green-500 hover:shadow-sm transition-all mb-4">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Łączenie...' : 'Kontynuuj z Google'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-xs">lub</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <input className="input" type="text" placeholder="Imię i nazwisko"
              value={name} onChange={e => setName(e.target.value)} />
          )}
          <input className="input" type="email" placeholder="Adres email"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Hasło"
            value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center py-3">
            {loading ? 'Ładowanie...' : mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          {mode === 'login' ? 'Nie masz konta? ' : 'Masz już konto? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-green-600 font-semibold hover:underline">
            {mode === 'login' ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </p>
      </div>
    </div>
  )
}
