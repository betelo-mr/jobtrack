import Stripe from 'stripe'
import { Router } from 'express'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICE_ID = 'price_1T5qzwA0VPRlBFsOaFipIxCV'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// ── Stwórz sesję płatności ──
router.post('/create-checkout', async (req, res) => {
  try {
    const { userId, userEmail } = req.body
    if (!userId || !userEmail) return res.status(400).json({ error: 'Brak danych użytkownika.' })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      mode: 'subscription',
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      customer_email: userEmail,
      metadata: { userId },
      success_url: `${FRONTEND_URL}/?payment=success`,
      cancel_url: `${FRONTEND_URL}/?payment=cancelled`,
      locale: 'pl',
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

    // Znajdź customera po emailu
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

// ── Webhook – aktywuj Pro po płatności ──
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
      : req.body
  } catch(e) {
    console.error('Webhook error:', e.message)
    return res.status(400).send(`Webhook Error: ${e.message}`)
  }

  // Obsługa eventów
  switch(event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.userId
      console.log(`✅ Płatność zakończona dla userId: ${userId}`)
      // TODO: zapisz status Pro w Firebase dla userId
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      console.log(`❌ Subskrypcja anulowana: ${sub.id}`)
      // TODO: usuń status Pro z Firebase
      break
    }
  }

  res.json({ received: true })
})

export default router
