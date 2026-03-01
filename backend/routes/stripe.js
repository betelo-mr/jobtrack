import Stripe from 'stripe'
import { Router } from 'express'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICE_ID = 'price_1T5qzwA0VPRlBFsOaFipIxCV'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'jobtrack-pl'

// ── Helper: update Firestore via REST API ──
async function updateFirestore(userId, data) {
  const fields = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'boolean') fields[key] = { booleanValue: value }
    else if (typeof value === 'string') fields[key] = { stringValue: value }
    else if (typeof value === 'number') fields[key] = { integerValue: value }
  }

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}?updateMask.fieldPaths=${Object.keys(data).join('&updateMask.fieldPaths=')}`

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firestore update failed: ${err}`)
  }

  return res.json()
}

// ── Stwórz sesję płatności ──
router.post('/create-checkout', async (req, res) => {
  try {
    const { userId, userEmail } = req.body
    if (!userId || !userEmail) return res.status(400).json({ error: 'Brak danych użytkownika.' })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      customer_email: userEmail,
      metadata: { userId },
      success_url: `${FRONTEND_URL}/?payment=success`,
      cancel_url: `${FRONTEND_URL}/?payment=cancelled`,
      locale: 'pl',
      allow_promotion_codes: true,
    })

    res.json({ url: session.url })
  } catch(e) {
    console.error(e)
    res.status(500).json({ error: 'Błąd tworzenia sesji płatności: ' + e.message })
  }
})

// ── Portal zarządzania subskrypcją ──
router.post('/customer-portal', async (req, res) => {
  try {
    const { userEmail } = req.body
    if (!userEmail) return res.status(400).json({ error: 'Brak emaila.' })

    const customers = await stripe.customers.list({ email: userEmail, limit: 1 })
    if (!customers.data.length) return res.status(404).json({ error: 'Nie znaleziono konta Stripe.' })

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${FRONTEND_URL}/`,
    })

    res.json({ url: session.url })
  } catch(e) {
    console.error(e)
    res.status(500).json({ error: 'Błąd portalu: ' + e.message })
  }
})

// ── Webhook ──
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
      : JSON.parse(req.body)
  } catch(e) {
    console.error('Webhook error:', e.message)
    return res.status(400).send(`Webhook Error: ${e.message}`)
  }

  try {
    switch(event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        if (userId) {
          await updateFirestore(userId, {
            isPro: true,
            stripeCustomerId: session.customer,
            proActivatedAt: new Date().toISOString(),
          })
          console.log(`✅ Pro aktywowane dla userId: ${userId}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Znajdź userId po stripeCustomerId
        const customerId = event.data.object.customer
        console.log(`❌ Subskrypcja anulowana dla customerId: ${customerId}`)
        // Szukamy usera po stripeCustomerId w Firestore
        const queryUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`
        const queryRes = await fetch(queryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            structuredQuery: {
              from: [{ collectionId: 'users' }],
              where: {
                fieldFilter: {
                  field: { fieldPath: 'stripeCustomerId' },
                  op: 'EQUAL',
                  value: { stringValue: customerId }
                }
              },
              limit: 1
            }
          })
        })
        const results = await queryRes.json()
        const doc = results[0]?.document
        if (doc) {
          const userId = doc.name.split('/').pop()
          await updateFirestore(userId, { isPro: false })
          console.log(`✅ Pro dezaktywowane dla userId: ${userId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const customerId = sub.customer
        const isActive = sub.status === 'active' || sub.status === 'trialing'
        console.log(`🔄 Subskrypcja zaktualizowana: ${customerId} → ${sub.status}`)
        // TODO: opcjonalnie aktualizuj status
        break
      }
    }
  } catch(e) {
    console.error('Webhook handler error:', e)
  }

  res.json({ received: true })
})

export default router
