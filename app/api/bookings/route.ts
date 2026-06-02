import { NextResponse } from 'next/server'
import { validateForm } from '@/lib/validation'
import { getPackageById } from '@/lib/packages'
import type { BookingFormData, BookingRecord, Emirate, ParkingType, PreferredWindow } from '@/types/booking'

/**
 * Booking request handler (App Router Route Handler — server-only).
 *
 * POST is never cached by Next, and this module is never bundled to the client,
 * so it is the correct place to read secrets LATER (SUPABASE_SERVICE_ROLE_KEY,
 * a Google service-account key, a Resend key). Do NOT import this file from a
 * client component, and never move those secrets into the form.
 *
 * Today it validates the payload, derives the authoritative package price/name,
 * builds a backend-ready BookingRecord with status `pending_confirmation`, and
 * returns a mock id. The integration seams below (Supabase / Google Calendar /
 * notifications) are no-ops that can be filled in without touching the frontend.
 */

function generateBookingId(): string {
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CCC-${stamp}-${rand}`
}

/**
 * Future Google Calendar integration boundary (no-op today).
 *
 * When wired with a server-side service account / OAuth client, this should:
 *   1. Read free/busy for the single inspector on `record.preferredDate`, within
 *      the time range of `record.preferredWindow` (see TIME_WINDOWS in
 *      lib/packages.ts: morning 09–12, afternoon 12–16, evening 16–20).
 *   2. Create a *tentative* hold/event spanning that window (status: tentative).
 *   3. Return the created event id so it can be stored as googleCalendarEventId.
 *
 * The owner later updates that event with the exact confirmed arrival time when
 * moving the booking from `pending_confirmation` -> `confirmed` (a separate
 * admin action, not part of this public endpoint).
 */
async function reserveCalendarHold(record: BookingRecord): Promise<string | null> {
  // No calendar connected yet. A real implementation would use
  // record.preferredDate within the record.preferredWindow range to check
  // free/busy, create a tentative hold, and return its event id.
  void record
  return null
}

/**
 * Future Supabase integration boundary (no-op today).
 *
 * Replace the body with an insert via `createServerClient()` from
 * '@/lib/supabase/server'. BookingRecord maps 1:1 to the `bookings` columns
 * (see supabase/migrations/001_bookings.sql), e.g.:
 *
 *   const supabase = createServerClient()
 *   const { error } = await supabase.from('bookings').insert({
 *     id: record.id,
 *     booking_status: record.status,
 *     package_id: record.packageId,
 *     // …map remaining camelCase fields to snake_case columns…
 *     google_calendar_event_id: record.googleCalendarEventId,
 *   })
 *   if (error) throw error
 */
async function persistBooking(record: BookingRecord): Promise<void> {
  // No database connected yet — nothing is stored. Logged for local visibility.
  console.log('[booking:stub] received booking request', {
    id: record.id,
    status: record.status,
    package: record.packageId,
    emirate: record.emirate,
    date: record.preferredDate,
    window: record.preferredWindow,
  })
}

export async function POST(req: Request) {
  let body: Partial<BookingFormData>
  try {
    body = (await req.json()) as Partial<BookingFormData>
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  // Normalise to the full form shape so the shared validator can run.
  const form: BookingFormData = {
    customerName: body.customerName ?? '',
    customerPhone: body.customerPhone ?? '',
    customerEmail: body.customerEmail ?? '',
    emirate: body.emirate ?? '',
    address: body.address ?? '',
    locationLat: body.locationLat ?? null,
    locationLng: body.locationLng ?? null,
    parkingType: body.parkingType ?? '',
    carMake: body.carMake ?? '',
    carModel: body.carModel ?? '',
    carYear: body.carYear ?? '',
    additionalNotes: body.additionalNotes ?? '',
    preferredDate: body.preferredDate ?? '',
    preferredWindow: body.preferredWindow ?? '',
    packageId: body.packageId ?? 'comprehensive',
  }

  const errors = validateForm(form)
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 })
  }

  // Price/name come from the canonical catalogue — never trust client-sent money.
  const pkg = getPackageById(form.packageId)
  if (!pkg) {
    return NextResponse.json({ ok: false, error: 'Unknown package selected.' }, { status: 422 })
  }

  // After validateForm() these enum-ish fields are guaranteed non-empty.
  const now = new Date().toISOString()
  const record: BookingRecord = {
    id: generateBookingId(),
    status: 'pending_confirmation',
    packageId: pkg.id,
    packageName: pkg.name,
    packagePrice: pkg.price,
    customerName: form.customerName.trim(),
    customerPhone: form.customerPhone.trim(),
    customerEmail: form.customerEmail.trim() || null,
    carMake: form.carMake.trim(),
    carModel: form.carModel.trim(),
    carYear: form.carYear,
    emirate: form.emirate as Emirate,
    parkingType: form.parkingType as ParkingType,
    address: form.address.trim(),
    locationLat: form.locationLat,
    locationLng: form.locationLng,
    preferredDate: form.preferredDate,
    preferredWindow: form.preferredWindow as PreferredWindow,
    additionalNotes: form.additionalNotes.trim() || null,
    googleCalendarEventId: null,
    createdAt: now,
    updatedAt: now,
  }

  // --- Future integrations (no-ops today, frontend won't change when wired) ---
  // 1) Reserve a tentative calendar hold for the chosen date/window.
  record.googleCalendarEventId = await reserveCalendarHold(record)
  // 2) Persist the booking (Supabase insert later).
  await persistBooking(record)
  // 3) (Later) Notify the team + customer via Resend / WhatsApp.

  return NextResponse.json({ ok: true, id: record.id, status: record.status })
}
