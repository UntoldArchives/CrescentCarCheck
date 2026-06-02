declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_EVENTS = {
  VIEW_PACKAGES: 'view_packages',
  SELECT_PACKAGE: 'select_package',
  BEGIN_CHECKOUT: 'begin_checkout',
  CHECKOUT_FORM_ERROR: 'checkout_form_error',
  CHECKOUT_SUBMITTED: 'checkout_submitted',
  BOOKING_CONFIRMED: 'booking_confirmed',
  CONTACT_SUBMITTED: 'contact_submitted',
  WHATSAPP_CLICK: 'whatsapp_click',
  PHONE_CLICK: 'phone_click',
  FAQ_OPENED: 'faq_opened',
} as const

type GAEventName = typeof GA_EVENTS[keyof typeof GA_EVENTS]

export function trackEvent(
  eventName: GAEventName,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

export function trackPurchase(booking: {
  id: string
  packageName: string
  packagePrice: number
}): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: booking.id,
      value: booking.packagePrice,
      currency: 'AED',
      items: [{
        item_id: booking.id,
        item_name: `${booking.packageName} Inspection`,
        price: booking.packagePrice,
        quantity: 1,
      }],
    })
  }
}
