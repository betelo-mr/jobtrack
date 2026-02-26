import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB6cLMSt0Yem-7hbIfisMze3mWXEgR9tuI",
  authDomain: "jobtrack-pl.firebaseapp.com",
  projectId: "jobtrack-pl",
  storageBucket: "jobtrack-pl.firebasestorage.app",
  messagingSenderId: "454821919098",
  appId: "1:454821919098:web:b2520d8d217153c4f27ec3"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
