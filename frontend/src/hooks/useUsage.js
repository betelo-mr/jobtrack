import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc, increment } from 'firebase/firestore'

const FREE_LIMIT = 3

function getMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function useUsage() {
  const user = useAuth()
  const [usage, setUsage] = useState(null)

  async function fetchUsage() {
    if (!user) return
    try {
      const monthKey = getMonthKey()
      const usageRef = doc(db, 'users', user.uid, 'usage', monthKey)
      const userRef = doc(db, 'users', user.uid)

      const [usageSnap, userSnap] = await Promise.all([
        getDoc(usageRef),
        getDoc(userRef)
      ])

      const count = usageSnap.exists() ? usageSnap.data().count || 0 : 0
      const isPro = userSnap.exists() ? userSnap.data()?.isPro === true : false

      setUsage({
        count,
        limit: FREE_LIMIT,
        remaining: isPro ? 999 : Math.max(0, FREE_LIMIT - count),
        isPro,
        month: monthKey,
      })
    } catch(e) {
      console.error('Usage fetch error:', e)
    }
  }

  async function incrementUsage() {
    if (!user) return { allowed: true }
    try {
      const monthKey = getMonthKey()
      const usageRef = doc(db, 'users', user.uid, 'usage', monthKey)
      const userRef = doc(db, 'users', user.uid)

      const [usageSnap, userSnap] = await Promise.all([
        getDoc(usageRef),
        getDoc(userRef)
      ])

      const count = usageSnap.exists() ? usageSnap.data().count || 0 : 0
      const isPro = userSnap.exists() ? userSnap.data()?.isPro === true : false

      if (!isPro && count >= FREE_LIMIT) {
        return { allowed: false, count, remaining: 0, isPro }
      }

      await setDoc(usageRef, { count: increment(1), updatedAt: new Date() }, { merge: true })
      await fetchUsage()
      return { allowed: true, count: count + 1, isPro }
    } catch(e) {
      console.error('Usage increment error:', e)
      return { allowed: true } // fail open – nie blokuj przy błędzie
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [user])

  return { usage, fetchUsage, incrementUsage }
}
