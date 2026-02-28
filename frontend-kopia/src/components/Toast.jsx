import { useState, useEffect } from 'react'

let toastFn = null
export function showToast(msg) { if (toastFn) toastFn(msg) }

export default function Toast() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    toastFn = m => {
      setMsg(m)
      setTimeout(() => setMsg(''), 3000)
    }
  }, [])

  if (!msg) return null

  return (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-green-600/30 text-sm font-semibold z-50 animate-fade-in">
      {msg}
    </div>
  )
}
