import { Emirate, Package, PreferredWindow } from '@/types/booking'

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
 * Preferred arrival windows. We deliberately do NOT offer exact times: there is
 * one inspector, so the customer picks a window and we confirm the precise
 * arrival time by WhatsApp once we've reviewed the car location and availability.
 */
export interface TimeWindow {
  id: PreferredWindow
  label: string
  range: string
}

export const TIME_WINDOWS: TimeWindow[] = [
  { id: 'morning', label: 'Morning', range: '9:00 AM – 12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', range: '12:00 PM – 4:00 PM' },
  { id: 'evening', label: 'Evening', range: '4:00 PM – 8:00 PM' },
]

export const getWindowById = (id: string): TimeWindow | undefined =>
  TIME_WINDOWS.find((w) => w.id === id)

// Note: the car make/model catalogue lives in lib/cars.ts (CAR_MAKES, MAKE_NAMES,
// modelsForMake) and the emirate list is defined where it's used (CheckoutForm,
// structured-data). Earlier duplicate copies here were removed to avoid drift.
