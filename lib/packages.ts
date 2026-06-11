import { DistanceClass, Emirate, Package, SlotTime } from '@/types/booking'

export const PACKAGES: Package[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 249,
    tagline: 'Core checks for everyday used cars.',
    inspectionPoints: '250+',
    features: [
      'Exterior visual inspection',
      'Interior condition check',
      'Exterior paint meter checks',
      'AC temperature check',
      'Tyres condition check',
      'Rims & brakes visual check',
      'Exterior lights & brake lights check',
      'Engine bay visual inspection',
      'Basic visible fluid leak check',
      'Accident history check',
    ],
    ctaLabel: 'Book Standard',
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    price: 349,
    popular: true,
    badge: 'Most Popular',
    tagline: 'A more detailed inspection for buyers who want extra confidence before committing.',
    inspectionPoints: '400+',
    features: [
      'Everything in Standard, plus:',
      'Full underbody inspection',
      'Photos of visible faults',
      'Panel gaps check',
      'Detailed visible fluid leak check',
      'Suspension visual check',
      'Test Drive Observations',
      'Transmission check',
      'Detailed photo report',
      'Buy / negotiate / avoid recommendation',
    ],
    ctaLabel: 'Book Comprehensive',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 449,
    tagline: 'Our most detailed inspection, designed for buyers who want the clearest picture before making a high-value purchase.',
    inspectionPoints: '600+',
    features: [
      'Everything in Comprehensive, plus:',
      'Endoscopic camera check for hard-to-see areas',
      'Detailed engine bay inspection',
      'Detailed engine and fluid leak check',
      'AC compressor check',
      'Extended OBD fault-code review',
      'Battery and electrical system review',
      '20-minute inspector summary call',
      'Price negotiation notes',
    ],
    ctaLabel: 'Book Premium',
  },
]

export const getPackageById = (id: string): Package | undefined =>
  PACKAGES.find(p => p.id === id)

/**
 * Travel pricing. Inspections in the nearer emirates are at the base package
 * price; the farther ones carry a flat travel surcharge. This is the single
 * source of truth — the checkout UI, the API and emails all derive the total
 * from here so the customer is never quoted one figure and charged another.
 */
export const TRAVEL_FEE = 100 // AED, flat

/** Locations that carry the flat travel surcharge. */
export const TRAVEL_FEE_EMIRATES: readonly Emirate[] = [
  'Abu Dhabi',
  'Al Ain',
  'Ras Al Khaimah',
  'Fujairah',
]

/** Travel surcharge for a given location (0 when none / not yet chosen). */
export const travelFeeForEmirate = (emirate: Emirate | ''): number =>
  emirate && TRAVEL_FEE_EMIRATES.includes(emirate) ? TRAVEL_FEE : 0

/** Total the customer pays = base package price + any travel surcharge. */
export const totalForPackage = (pkg: Package, emirate: Emirate | ''): number =>
  pkg.price + travelFeeForEmirate(emirate)

/**
 * Fixed daily inspection slots (one inspector, Asia/Dubai). The DB value is the
 * 24-hour slot start; the label is what customers see. The slot rules (long-
 * distance = 9:30 AM only + travel buffer, 1-hour minimum notice) are enforced
 * by the booking_slot_availability / create_booking_hold RPCs in the shared
 * Supabase project — this list only drives display and form options.
 */
export interface Slot {
  value: SlotTime
  label: string
}

export const SLOTS: Slot[] = [
  { value: '09:30', label: '9:30 AM' },
  { value: '11:45', label: '11:45 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '16:15', label: '4:15 PM' },
  { value: '18:30', label: '6:30 PM' },
]

/** Display label for a slot DB value (falls back to the raw value). */
export const slotLabel = (slot: string): string =>
  SLOTS.find((s) => s.value === slot)?.label ?? slot

export const isSlotTime = (s: string): s is SlotTime =>
  SLOTS.some((slot) => slot.value === s)

/** Distance class for an emirate: 'long' iff it carries the travel fee. */
export const distanceClassForEmirate = (emirate: Emirate | ''): DistanceClass =>
  emirate && TRAVEL_FEE_EMIRATES.includes(emirate) ? 'long' : 'normal'

// Note: the car make/model catalogue lives in lib/cars.ts (CAR_MAKES, MAKE_NAMES,
// modelsForMake) and the emirate list is defined where it's used (CheckoutForm,
// structured-data). Earlier duplicate copies here were removed to avoid drift.
