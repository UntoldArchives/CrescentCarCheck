export type ParkingType = 'showroom' | 'outdoor' | 'home'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
/** Lifecycle of a booking request. A new request starts as pending_confirmation;
 *  the owner confirms the exact arrival time before it becomes `confirmed`. */
export type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
export type PackageId = 'standard' | 'comprehensive' | 'premium'
export type Emirate = 'Abu Dhabi' | 'Dubai' | 'Sharjah' | 'Ajman' | 'Umm Al Quwain' | 'Ras Al Khaimah' | 'Fujairah' | 'Al Ain'
/** Preferred arrival window. The exact time is confirmed later by WhatsApp. */
export type PreferredWindow = 'morning' | 'afternoon' | 'evening'

export interface Package {
  id: PackageId
  name: string
  price: number // AED
  popular?: boolean
  badge?: string
  tagline: string
  features: string[]
  notIncluded?: string[]
  ctaLabel: string
  inspectionPoints: string
}

/**
 * Shape collected by the checkout form and POSTed to /api/bookings.
 * Package price/name are intentionally NOT included here — the server derives
 * them from `packageId` against the canonical catalogue so a client can't spoof
 * the price.
 */
export interface BookingFormData {
  customerName: string
  customerPhone: string
  customerEmail: string
  emirate: Emirate | ''
  address: string
  locationLat: number | null
  locationLng: number | null
  parkingType: ParkingType | ''
  carMake: string
  carModel: string
  carYear: string
  additionalNotes: string
  preferredDate: string // ISO yyyy-mm-dd
  preferredWindow: PreferredWindow | ''
  packageId: PackageId
}

export type BookingFormErrors = Partial<Record<keyof BookingFormData, string>>

/**
 * Backend-ready booking record. This is what the API builds from a validated
 * BookingFormData and (later) inserts into Supabase. Field names map 1:1 to the
 * planned `bookings` columns. `googleCalendarEventId` is filled once a calendar
 * hold is created for the request.
 */
export interface BookingRecord {
  id: string
  status: BookingStatus
  packageId: PackageId
  packageName: string
  /** Base package price in AED, before any travel fee. */
  packagePrice: number
  /** Flat travel surcharge in AED for far emirates (0 for none). */
  travelFee: number
  /** Amount the customer pays: packagePrice + travelFee. */
  totalPrice: number
  customerName: string
  customerPhone: string
  customerEmail: string | null
  carMake: string
  carModel: string
  carYear: string
  emirate: Emirate
  parkingType: ParkingType
  address: string
  locationLat: number | null
  locationLng: number | null
  preferredDate: string
  preferredWindow: PreferredWindow
  additionalNotes: string | null
  googleCalendarEventId: string | null
  createdAt: string
  updatedAt: string
}

/** Eventual Supabase row (snake_case). Mirrors supabase/migrations/001_bookings.sql. */
export interface Booking {
  id: string
  created_at: string
  updated_at: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  emirate: string
  address: string
  location_lat: number | null
  location_lng: number | null
  parking_type: ParkingType
  car_make: string
  car_model: string
  car_year: string
  preferred_date: string
  preferred_window: PreferredWindow
  additional_notes: string | null
  package_id: PackageId
  package_name: string
  package_price: number
  travel_fee: number
  total_price: number
  google_calendar_event_id: string | null
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  payment_status: PaymentStatus
  booking_status: BookingStatus
}
