import { getResend, isResendConfigured } from '@/lib/resend'
import { getWindowById } from '@/lib/packages'
import type { BookingRecord } from '@/types/booking'

/**
 * Transactional email layer (server-only).
 *
 * Every function here is BEST-EFFORT and never throws: if Resend isn't
 * configured yet, or a send fails, we log and resolve. Booking persistence is
 * the source of truth — email is a notification on top of it, so a mail hiccup
 * must never fail the user's request.
 *
 * Activate by setting RESEND_API_KEY (+ RESEND_FROM_EMAIL, BUSINESS_OWNER_EMAIL).
 */

const OWNER_EMAIL = process.env.BUSINESS_OWNER_EMAIL || ''

/** Resend wants either "email" or "Name <email>". Normalise to the branded form. */
function fromAddress(): string {
  const raw = process.env.RESEND_FROM_EMAIL || 'bookings@crescentcarcheck.com'
  return raw.includes('<') ? raw : `Crescent Car Check <${raw}>`
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#0A0A0A;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;font-weight:700;font-size:18px;">
      <span style="color:#FFC600;">Crescent</span> Car Check
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;">
      <h1 style="font-size:20px;margin:0 0 16px;">${esc(title)}</h1>
      ${bodyHtml}
    </div>
    <p style="color:#a1a1aa;font-size:12px;text-align:center;margin-top:16px;">
      Crescent Car Check · Pre-purchase car inspections across the UAE
    </p>
  </div></body></html>`
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#71717a;font-size:13px;vertical-align:top;white-space:nowrap;">${esc(label)}</td>
    <td style="padding:6px 0;font-size:14px;font-weight:600;">${value}</td>
  </tr>`
}

function bookingTable(record: BookingRecord): string {
  const win = getWindowById(record.preferredWindow)
  const windowText = win ? `${win.label} (${win.range})` : record.preferredWindow
  // Coerce to finite numbers before interpolating into the href. The API uses a
  // type-assertion (not runtime validation), so these could arrive as arbitrary
  // JSON; forcing them to real numbers makes HTML/URL injection impossible.
  const lat = Number(record.locationLat)
  const lng = Number(record.locationLng)
  const hasCoords =
    record.locationLat != null &&
    record.locationLng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  const mapLink = hasCoords
    ? `<a href="https://www.google.com/maps?q=${lat},${lng}" style="color:#a16207;">Open in Maps</a>`
    : ''
  return `<table style="width:100%;border-collapse:collapse;">
    ${row('Reference', esc(record.id))}
    ${row('Package', `${esc(record.packageName)} — AED ${record.packagePrice}`)}
    ${record.travelFee > 0 ? row('Travel fee', `AED ${record.travelFee} (${esc(record.emirate)})`) : ''}
    ${row('Total', `AED ${record.totalPrice}`)}
    ${row('Name', esc(record.customerName))}
    ${row('Phone', esc(record.customerPhone))}
    ${row('Email', esc(record.customerEmail || '—'))}
    ${row('Vehicle', esc(`${record.carMake} ${record.carModel} (${record.carYear})`))}
    ${row('Emirate', esc(record.emirate))}
    ${row('Parking', esc(record.parkingType))}
    ${row('Address', `${esc(record.address)} ${mapLink}`)}
    ${row('Preferred date', esc(record.preferredDate))}
    ${row('Preferred window', esc(windowText))}
    ${record.additionalNotes ? row('Notes', esc(record.additionalNotes)) : ''}
  </table>`
}

/**
 * Sends the owner a new-booking alert and (if an email was provided) a
 * confirmation to the customer. Safe to await — never throws.
 */
export async function notifyNewBooking(record: BookingRecord): Promise<void> {
  if (!isResendConfigured()) {
    console.log('[email] Resend not configured — skipping booking notifications', {
      id: record.id,
    })
    return
  }

  const resend = getResend()
  const from = fromAddress()

  // 1) Owner alert
  if (OWNER_EMAIL) {
    try {
      await resend.emails.send({
        from,
        to: OWNER_EMAIL,
        replyTo: record.customerEmail || undefined,
        subject: `New booking ${record.id} — ${record.packageName} (${record.emirate})`,
        html: layout(
          'New inspection request',
          `<p style="font-size:14px;color:#3f3f46;margin:0 0 16px;">A new booking request just came in:</p>${bookingTable(record)}`,
        ),
      })
    } catch (err) {
      console.error('[email] owner booking alert failed', err)
    }
  } else {
    console.warn('[email] BUSINESS_OWNER_EMAIL not set — owner alert skipped')
  }

  // 2) Customer confirmation (only if they shared an email)
  if (record.customerEmail) {
    try {
      await resend.emails.send({
        from,
        to: record.customerEmail,
        subject: `We've received your booking request (${record.id})`,
        html: layout(
          `Thanks, ${esc(record.customerName.split(' ')[0] || 'there')}!`,
          `<p style="font-size:14px;color:#3f3f46;margin:0 0 16px;">
             We've received your booking and payment, and we'll confirm the exact arrival
             time on WhatsApp shortly.
           </p>
           <p style="font-size:14px;color:#3f3f46;margin:0 0 16px;">Here's what you booked:</p>
           ${bookingTable(record)}`,
        ),
      })
    } catch (err) {
      console.error('[email] customer confirmation failed', err)
    }
  }
}

export interface ContactMessage {
  name: string
  email: string
  phone?: string
  topic?: string
  carMake?: string
  carModel?: string
  carYear?: string
  message: string
}

/** Forwards a contact-form submission to the owner inbox. Never throws. */
export async function notifyContactMessage(msg: ContactMessage): Promise<void> {
  if (!isResendConfigured()) {
    console.log('[email] Resend not configured — skipping contact notification')
    return
  }
  if (!OWNER_EMAIL) {
    console.warn('[email] BUSINESS_OWNER_EMAIL not set — contact notification skipped')
    return
  }

  const vehicle = [msg.carMake, msg.carModel, msg.carYear].filter(Boolean).join(' ').trim()

  try {
    await getResend().emails.send({
      from: fromAddress(),
      to: OWNER_EMAIL,
      replyTo: msg.email,
      subject: `Contact form: ${msg.topic || 'General'} — ${msg.name}`,
      html: layout(
        'New contact message',
        `<table style="width:100%;border-collapse:collapse;">
           ${row('Name', esc(msg.name))}
           ${row('Email', esc(msg.email))}
           ${row('Phone', esc(msg.phone || '—'))}
           ${row('Topic', esc(msg.topic || 'General'))}
           ${vehicle ? row('Vehicle', esc(vehicle)) : ''}
         </table>
         <p style="font-size:14px;color:#3f3f46;margin:16px 0 0;white-space:pre-wrap;">${esc(msg.message)}</p>`,
      ),
    })
  } catch (err) {
    console.error('[email] contact notification failed', err)
  }
}
