import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function useApplications(userId) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setApplications([]); setLoading(false); return }
    loadApps()
  }, [userId])

  async function loadApps() {
    setLoading(true)
    try {
      const q = query(collection(db, 'users', userId, 'applications'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function addApplication(data) {
    const docRef = await addDoc(collection(db, 'users', userId, 'applications'), {
      ...data, createdAt: serverTimestamp()
    })
    const newApp = { id: docRef.id, ...data, createdAt: new Date() }
    setApplications(prev => [newApp, ...prev])
    return newApp
  }

  async function deleteApplication(id) {
    await deleteDoc(doc(db, 'users', userId, 'applications', id))
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  return { applications, loading, addApplication, deleteApplication, reload: loadApps }
}
