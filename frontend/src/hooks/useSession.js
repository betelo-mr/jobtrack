import { useEffect, useState, useRef } from 'react'
import { db } from '../firebase'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function useSession(user) {
  const [sessionValid, setSessionValid] = useState(true)
  const tokenRef = useRef(null) // trzymamy aktualny token w ref

  useEffect(() => {
    if (!user) return

    const storageKey = `jobtrack-session-${user.uid}`
    let token = localStorage.getItem(storageKey)

    if (!token) {
      token = generateToken()
      localStorage.setItem(storageKey, token)
    }

    tokenRef.current = token

    const userRef = doc(db, 'users', user.uid)
    setDoc(userRef, { activeSessionToken: token }, { merge: true })

    const unsubscribe = onSnapshot(userRef, snap => {
      if (!snap.exists()) return
      const remoteToken = snap.data()?.activeSessionToken
      // Porównuj zawsze z aktualnym tokenRef
      if (remoteToken && remoteToken !== tokenRef.current) {
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
    const newToken = generateToken()
    localStorage.setItem(storageKey, newToken)
    tokenRef.current = newToken // zaktualizuj ref przed zapisem do Firestore
    setDoc(doc(db, 'users', user.uid), { activeSessionToken: newToken }, { merge: true })
    setSessionValid(true)
  }

  return { sessionValid, forceRelogin }
}
