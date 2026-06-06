import { BookingFormData, BookingFormErrors } from '@/types/booking'

/** Earliest acceptable booking date (today) as a local yyyy-mm-dd string. */
function todayISO(): string {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

/**
 * Accepts UAE-style phone numbers, tolerating spaces, dashes and a +971 / 0
 * prefix: e.g. "+971 50 123 4567", "0501234567", "50 123 4567".
 */
function isValidUaePhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  const local = digits.replace(/^971/, '').replace(/^0/, '')
  // UAE local numbers are 8–9 digits (mobiles are 9, starting 5).
  return /^\d{8,9}$/.test(local)
}

export function validateForm(form: BookingFormData): BookingFormErrors {
  const errors: BookingFormErrors = {}

  if (!form.customerName.trim()) {
    errors.customerName = 'Full name is required'
  } else if (form.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name'
  }

  if (!form.customerPhone.trim()) {
    errors.customerPhone = 'Phone number is required'
  } else if (!isValidUaePhone(form.customerPhone)) {
    errors.customerPhone = 'Please enter a valid UAE number (e.g. 050 123 4567)'
  }

  if (form.customerEmail && form.customerEmail.trim()) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(form.customerEmail.trim())) {
      errors.customerEmail = 'Please enter a valid email address'
    }
  }

  if (!form.emirate) errors.emirate = 'Please select an emirate'
  if (!form.address.trim()) errors.address = 'Please enter or search for a location'
  if (!form.parkingType) errors.parkingType = 'Please select a parking type'
  if (!form.carMake) errors.carMake = 'Please select the car brand'
  if (!form.carModel.trim()) errors.carModel = 'Please enter the car model'
  if (!form.carYear) errors.carYear = 'Please select the year'

  if (!form.preferredDate) {
    errors.preferredDate = 'Please choose a preferred date'
  } else if (form.preferredDate < todayISO()) {
    errors.preferredDate = 'Please choose today or a future date'
  }
  if (!form.preferredWindow) errors.preferredWindow = 'Please choose a preferred time window'

  return errors
}

export function scrollToFirstError(errors: BookingFormErrors): void {
  const firstKey = Object.keys(errors)[0]
  if (!firstKey) return
  const el = document.getElementById(`field-${firstKey}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = el.querySelector('input, select, textarea') as HTMLElement | null
    input?.focus()
  }
}
