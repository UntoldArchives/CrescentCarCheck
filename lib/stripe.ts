import Stripe from 'stripe'
import { HOLD_MINUTES } from '@/lib/availability'
import type { BookingRecord } from '@/types/booking'

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

/**
 * Creates a Stripe Checkout Session for a booking hold. The amount and name are
 * derived from the server-built record (never client-sent money). booking_id is
 * stamped in metadata so the webhook can resolve the booking on success/expiry.
 */
export async function createCheckoutSession(
  record: BookingRecord,
  appUrl: string,
): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.create({
    mode: 'payment',
    // Charge in AED. unit_amount is in fils (1 AED = 100 fils).
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'aed',
          unit_amount: record.totalPrice * 100,
          product_data: {
            name: `Crescent Car Check - ${record.packageName} Inspection`,
            description: `${record.carMake} ${record.carModel} (${record.carYear}) · ${record.emirate}`,
          },
        },
      },
    ],
    ...(record.customerEmail ? { customer_email: record.customerEmail } : {}),
    metadata: {
      booking_id: record.id,
      package_id: record.packageId,
      inspection_date: record.inspectionDate,
      slot_time: record.slotTime,
    },
    success_url: `${appUrl}/confirmation?id=${encodeURIComponent(record.id)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout?package=${record.packageId}&cancelled=1`,
  })
}
