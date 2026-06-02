import { Package, PreferredWindow } from '@/types/booking'

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
      'OBD diagnostic scan',
      'Battery health check',
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
      'Road-test observations, where possible',
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
      'Transmission check',
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

export const CAR_MAKES = [
  'Toyota', 'Nissan', 'Mercedes-Benz', 'BMW', 'Audi',
  'Land Rover', 'Hyundai', 'Kia', 'Honda', 'Lexus',
  'Chevrolet', 'Other',
] as const

export type CarMake = typeof CAR_MAKES[number]

export const EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
  'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah',
] as const
