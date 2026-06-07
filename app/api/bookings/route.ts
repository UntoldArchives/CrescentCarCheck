import { NextResponse } from 'next/server'
import { validateForm } from '@/lib/validation'
import { getPackageById, travelFeeForEmirate } from '@/lib/packages'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { notifyNewBooking } from '@/lib/email'
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
 * Persist the booking to Supabase when configured. BookingRecord maps 1:1 to the
 * `bookings` columns (see supabase/migrations/001_bookings.sql). While Supabase
 * is not configured this is a no-op + log, so the UI works today and starts
 * persisting the moment the env keys are added — no frontend change required.
 *
 * Throws on a real DB error (only possible when configured) so the caller can
 * tell the user the request was not saved instead of pretending it succeeded.
 */
async function persistBooking(record: BookingRecord): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('[booking] Supabase not configured — request validated but not stored', {
      id: record.id,
      status: record.status,
      package: record.packageId,
      emirate: record.emirate,
      date: record.preferredDate,
      window: record.preferredWindow,
    })
    return
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('bookings').insert({
    id: record.id,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    customer_name: record.customerName,
    customer_phone: record.customerPhone,
    customer_email: record.customerEmail,
    emirate: record.emirate,
    address: record.address,
    location_lat: record.locationLat,
    location_lng: record.locationLng,
    parking_type: record.parkingType,
    additional_notes: record.additionalNotes,
    car_make: record.carMake,
    car_model: record.carModel,
    car_year: record.carYear,
    preferred_date: record.preferredDate,
    preferred_window: record.preferredWindow,
    package_id: record.packageId,
    package_name: record.packageName,
    package_price: record.packagePrice,
    travel_fee: record.travelFee,
    total_price: record.totalPrice,
    google_calendar_event_id: record.googleCalendarEventId,
    booking_status: record.status,
    // payment_status defaults to 'pending'; stripe_* columns stay null until wired.
  })
  if (error) throw error
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
  // Travel fee + total are derived server-side from the canonical rule so the
  // customer can't tamper with the surcharge.
  const emirate = form.emirate as Emirate
  const travelFee = travelFeeForEmirate(emirate)
  const now = new Date().toISOString()
  const record: BookingRecord = {
    id: generateBookingId(),
    status: 'pending_confirmation',
    packageId: pkg.id,
    packageName: pkg.name,
    packagePrice: pkg.price,
    travelFee,
    totalPrice: pkg.price + travelFee,
    customerName: form.customerName.trim(),
    customerPhone: form.customerPhone.trim(),
    customerEmail: form.customerEmail.trim() || null,
    carMake: form.carMake.trim(),
    carModel: form.carModel.trim(),
    carYear: form.carYear,
    emirate,
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

  // --- Integrations (each dormant until its env keys are present) ---
  // 1) Reserve a tentative calendar hold for the chosen date/window.
  // 2) Persist the booking (Supabase insert when configured).
  // A failure in either means the request was NOT saved — tell the user rather
  // than pretending it went through.
  try {
    record.googleCalendarEventId = await reserveCalendarHold(record)
    await persistBooking(record)
  } catch (err) {
    console.error('[booking] failed to save booking request', err)
    return NextResponse.json(
      {
        ok: false,
        error:
          'We could not save your request just now. Please try again, or message us on WhatsApp.',
      },
      { status: 500 },
    )
  }

  // 3) Notify the team + customer by email. Best-effort: the booking is already
  //    saved, so an email failure must not fail the request (notifyNewBooking
  //    swallows its own errors).
  await notifyNewBooking(record)

  return NextResponse.json({ ok: true, id: record.id, status: record.status })
}
