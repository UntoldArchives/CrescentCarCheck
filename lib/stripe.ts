import Stripe from 'stripe'

/**
 * Lazy Stripe client.
 *
 * Importing this module must NEVER throw — the site ships before the client has
 * provisioned a Stripe account, and route handlers may import this file while
 * keys are still empty. We therefore defer the "key is required" error until the
 * client is actually used (getStripe()), and expose isStripeConfigured() so
 * callers can branch instead of throwing.
 */
let client: Stripe | null = null

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set — cannot create a Stripe client.')
  }
  if (!client) {
    client = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
      appInfo: {
        name: 'Crescent Car Check',
        version: '1.0.0',
      },
    })
  }
  return client
}
