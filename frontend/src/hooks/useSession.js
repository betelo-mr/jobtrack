import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function useSession(user) {
  const [sessionValid, setSessionValid] = useState(true)

  useEffect(() => {
    if (!user) return

    const storageKey = `jobtrack-session-${user.uid}`
    let token = localStorage.getItem(storageKey)

    // Generuj nowy token jeśli nie ma
    if (!token) {
      token = generateToken()
      localStorage.setItem(storageKey, token)
    }

    // Zapisz token w Firestore jako aktywna sesja
    const userRef = doc(db, 'users', user.uid)
    setDoc(userRef, { activeSessionToken: token }, { merge: true })

    // Nasłuchuj zmian – jeśli token się zmieni = ktoś zalogował się na innym urządzeniu
    const unsubscribe = onSnapshot(userRef, snap => {
      if (!snap.exists()) return
      const remoteToken = snap.data()?.activeSessionToken
      if (remoteToken && remoteToken !== token) {
        setSessionValid(false)
      } else {
        setSessionValid(true)
      }
    })

    return () => unsubscribe()
  }, [user])

  function forceRelogin(user) {
    if (!user) return
    const storageKey = `jobtrack-session-${user.uid}`
    const token = generateToken()
    localStorage.setItem(storageKey, token)
    setDoc(doc(db, 'users', user.uid), { activeSessionToken: token }, { merge: true })
    setSessionValid(true)
  }

  return { sessionValid, forceRelogin }
}
