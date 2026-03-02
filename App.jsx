import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { useApplications } from './hooks/useApplications'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Tracker from './pages/Tracker'
import AIAssistant from './pages/AIAssistant'
import Jobs from './pages/Jobs'
import Analytics from './pages/Analytics'
import ComingSoon from './pages/ComingSoon'
import Sidebar from './components/Sidebar'
import AddAppModal from './components/AddAppModal'
import Toast, { showToast } from './components/Toast'
import UpgradeModal from './components/UpgradeModal'
import OnboardingWizard from './components/OnboardingWizard'
import { useSession } from './hooks/useSession'
import { doc, getDoc, getDocFromServer, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useEffect } from 'react'

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', sub: user => `Witaj z powrotem, ${user?.displayName?.split(' ')[0] || 'użytkowniku'}! 👋` },
  tracker:   { title: 'Moje aplikacje', sub: () => 'Śledź wszystkie aplikacje w jednym miejscu.' },
  ai:        { title: 'AI Asystent', sub: () => 'Analiza CV i mapa umiejętności powered by AI.' },
  jobs:      { title: 'Oferty pracy', sub: () => 'Oferty z LinkedIn, Pracuj.pl, NoFluffJobs i więcej.' },
  analytics: { title: 'Analityka', sub: () => 'Analizuj skuteczność i popraw wyniki.' },
}

export default function App() {
  const user = useAuth()
  const { applications, loading, addApplication, deleteApplication } = useApplications(user?.uid)
  const [page, setPage] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const { sessionValid, forceRelogin } = useSession(user)

  useEffect(() => {
    if (!user) return
    getDocFromServer(doc(db, 'users', user.uid)).then(snap => {
      const data = snap.exists() ? snap.data() : {}
      // Pokaż onboarding tylko jeśli pole NIE istnieje w Firestore
      if (snap.exists() && data.onboardingCompleted === true) {
        setShowOnboarding(false)
      } else if (!snap.exists()) {
        setShowOnboarding(true)
      } else if (data.onboardingCompleted !== true) {
        setShowOnboarding(true)
      }
      setIsPro(data?.isPro === true)
    })
  }, [user])

  // Listen for upgrade event from any component
  useEffect(() => {
    const handler = () => setShowUpgrade(true)
    window.addEventListener('show-upgrade', handler)
    return () => window.removeEventListener('show-upgrade', handler)
  })

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in – show landing or auth
  if (!user) {
    if (showAuth) return <AuthPage />
    return <LandingPage onLogin={() => setShowAuth(true)} />
  }

  // Handle Stripe return
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('payment') === 'success') {
    window.history.replaceState({}, '', '/')
    // Zapisz isPro w Firestore
    if (user) {
      setDoc(doc(db, 'users', user.uid), {
        isPro: true,
        proActivatedAt: new Date().toISOString(),
      }, { merge: true })
        .then(() => showToast('🎉 Witamy w Pro! Twoje konto zostało uaktualnione.'))
        .catch(() => showToast('🎉 Płatność przyjęta! Odśwież stronę aby aktywować Pro.'))
    } else {
      showToast('🎉 Płatność przyjęta! Zaloguj się aby aktywować Pro.')
    }
  }

  const pageInfo = PAGE_TITLES[page]

  async function handleAddApplication(data) {
    await addApplication(data)
    showToast(`✓ ${data.company} dodano do trackera!`)
  }

  async function handleQuickApply(company, position) {
    await addApplication({ company, position, location: 'Zdalnie', portal: 'JobTrack', status: 'sent', notes: '' })
    showToast(`✓ ${company} dodano do trackera!`)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} page={page} setPage={setPage} appCount={applications.length} isPro={isPro} />

      <main className="ml-60 flex-1">
        {/* Session invalid banner */}
        {!sessionValid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.7)'}}>
            <div className="rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" style={{backgroundColor:'var(--bg-card)'}}>
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="font-display font-black text-xl mb-2" style={{color:'var(--text-primary)'}}>Konto aktywne gdzie indziej</h2>
              <p className="text-sm mb-6" style={{color:'var(--text-secondary)'}}>
                Twoje konto JobTrack zostało otwarte na innym urządzeniu. Jeden plan Pro = jedno urządzenie na raz.
              </p>
              <button onClick={() => forceRelogin(user)} className="btn-primary w-full justify-center py-3">
                Używaj na tym urządzeniu
              </button>
            </div>
          </div>
        )}
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-gray-800">{pageInfo.title}</h2>
            <p className="text-sm text-gray-400 font-light mt-0.5">{pageInfo.sub(user)}</p>
          </div>
          {isPro ? (
            <button onClick={async () => {
              try {
                const res = await fetch('/stripe/customer-portal', {
                  method: 'POST',
                  headers: {'Content-Type':'application/json'},
                  body: JSON.stringify({ userEmail: user.email })
                })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              } catch(e) { showToast('Błąd otwierania portalu Stripe') }
            }}
              className="btn-ghost mr-2 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              Pro · Zarządzaj
            </button>
          ) : (
            <button onClick={() => setShowUpgrade(true)} className="btn-ghost mr-2 text-sm">⚡ Przejdź na Pro</button>
          )}
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <span>+</span> Dodaj aplikację
          </button>
        </div>

        {/* Page content */}
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {page === 'dashboard' && <Dashboard applications={applications} onAdd={() => setShowModal(true)} setPage={setPage} />}
              {page === 'tracker'   && <Tracker applications={applications} onAdd={() => setShowModal(true)} onDelete={deleteApplication} />}
              {page === 'ai'        && <AIAssistant />}
              {page === 'jobs'      && <ComingSoon feature='jobs' />}
              {page === 'analytics' && <ComingSoon feature='analytics' />}
            </>
          )}
        </div>
      </main>

      {showModal && <AddAppModal onClose={() => setShowModal(false)} onSave={handleAddApplication} />}
      <Toast />
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {showOnboarding && <OnboardingWizard onComplete={() => setShowOnboarding(false)} />}
    </div>
  )
}
