import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import {
  attachCalendarEvent,
  markBookingCancelled,
  markBookingPaid,
  rowToRecord,
} from '@/lib/availability'
import { notifyPaidBooking } from '@/lib/email'
import { createTentativeHold } from '@/lib/calendar'
import type { Booking } from '@/types/booking'

/**
 * Stripe webhook (server-only). The source of truth for payment outcome.
 *
 * - Reads the RAW body (required for signature verification).
 * - Verifies STRIPE_WEBHOOK_SECRET.
 * - checkout.session.completed → booking becomes paid + "New" (paid_new) via the
 *   confirm_booking_paid RPC, then owner/customer emails + a tentative calendar
 *   hold are sent.
 * - checkout.session.expired / payment_intent.payment_failed → booking cancelled,
 *   freeing the window.
 *
 * Idempotent: the paid/cancelled transitions only fire on a still-pending hold
 * (conditional DB update), so repeated deliveries safely no-op and never send
 * duplicate emails.
 */

// Force the Node.js runtime: Stripe signature verification needs Node crypto and
// the un-parsed request body.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] Stripe not configured — ignoring event')
    return NextResponse.json({ ok: false, error: 'Not configured.' }, { status: 503 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'Missing signature.' }, { status: 400 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = await getStripe().webhooks.constructEventAsync(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        await handlePaid(session)
        break
      }
      case 'checkout.session.expired': {
        const session = event.data.object
        const bookingId = session.metadata?.booking_id
        if (bookingId) await markBookingCancelled(bookingId)
        break
      }
      case 'payment_intent.payment_failed': {
        // Best-effort: only relevant once a payment intent is linked to a booking.
        const intent = event.data.object
        const bookingId = intent.metadata?.booking_id
        if (bookingId) await markBookingCancelled(bookingId)
        break
      }
      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break
    }
  } catch (err) {
    // Return 500 so Stripe retries — but only for genuine processing failures.
    console.error('[webhook] handler error', event.type, err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handlePaid(session: Stripe.Checkout.Session): Promise<void> {
  const bookingId = session.metadata?.booking_id
  if (!bookingId) {
    console.error('[webhook] checkout.session.completed without booking_id')
    return
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null)

  // Idempotent: only a still-pending hold transitions; a repeat returns null.
  const row = await markBookingPaid(bookingId, paymentIntentId)
  if (!row) {
    console.log('[webhook] booking already processed — no-op', { bookingId })
    return
  }

  const record = rowToRecord(row as Booking)

  // Notify owner + customer. Best-effort (never throws).
  await notifyPaidBooking(record)

  // Tentative calendar hold — must NOT fail the paid booking.
  try {
    const eventId = await createTentativeHold(record)
    if (eventId) await attachCalendarEvent(record.id, eventId)
  } catch (err) {
    console.error('[webhook] calendar hold failed (ignored)', err)
  }
}
