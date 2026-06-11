import { slotLabel } from '@/lib/packages'
import type { BookingRecord } from '@/types/booking'

/**
 * Google Calendar boundary (server-only, best-effort, no-op today).
 *
 * After a booking is PAID, the webhook calls this to drop a *tentative* hold on
 * the inspector's calendar for the chosen date/slot. The exact arrival time is
 * still confirmed manually by WhatsApp — this is only a coarse placeholder so the
 * day/slot isn't double-booked at a glance.
 *
 * Deliberately not wired to a real Google client yet: it returns null and never
 * throws, so a Calendar problem can never fail an already-successful payment. To
 * activate, implement the create call here (service account / OAuth) using the
 * slot start time below and return the created event id; the caller stores it as
 * google_calendar_event_id.
 */
export async function createTentativeHold(record: BookingRecord): Promise<string | null> {
  // A real implementation would create a tentative event starting at the slot
  // time on record.inspectionDate and return its event id.
  console.log('[calendar] tentative hold (no-op — Calendar not wired)', {
    id: record.id,
    date: record.inspectionDate,
    slot: slotLabel(record.slotTime),
  })
  return null
}
