'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, FileText } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

// Where each sample card points. A polished placeholder for now — swap to the
// real per-car report links once the client provides the sample PDFs.
const SAMPLE_REPORT_HREF = '/sample-report'

interface InspectedCar {
  make: string
  model: string
  description: string
  rating: number
  mileage: string
  fuel: string
  image?: string
  featured?: boolean
}

const PLACEHOLDER_IMAGE = '/s-class.png'

// Drop matching files into public/cars/ (transparent PNG preferred so the radial mask blends).
const CARS: InspectedCar[] = [
  {
    make: 'BMW',
    model: 'X5',
    description: 'Luxury SUV with powerful performance and comfort.',
    rating: 4.7,
    mileage: '48,500 km',
    fuel: 'Petrol',
    image: '/cars/bmw-x5.png',
  },
  {
    make: 'Cadillac',
    model: 'Escalade',
    description: 'Full-size luxury SUV with commanding presence and advanced features.',
    rating: 4.8,
    mileage: '62,300 km',
    fuel: 'Petrol',
    image: '/cars/cadillac-escalade.png',
  },
  {
    make: 'Audi',
    model: 'A6',
    description: 'Executive sedan that blends elegance with dynamic performance.',
    rating: 4.6,
    mileage: '41,200 km',
    fuel: 'Petrol',
    image: '/cars/audi-a6.png',
  },
  {
    make: 'Mercedes-Benz',
    model: 'GLE',
    description: 'Premium SUV offering refinement, safety, and all-terrain capability.',
    rating: 4.9,
    mileage: '55,800 km',
    fuel: 'Diesel',
    featured: true,
    image: '/cars/Mercedes Benz GLE.png',
  },
  {
    make: 'Porsche',
    model: 'Cayenne',
    description: 'Sporty SUV delivering thrilling performance and luxury.',
    rating: 4.7,
    mileage: '37,900 km',
    fuel: 'Petrol',
    image: '/cars/porsche-cayenne.png',
  },
]

function Squiggle() {
  return (
    <svg
      viewBox="0 0 80 24"
      className="mx-auto w-16 h-5 mb-3"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 14c6-12 14 8 22-4s16 16 24 4 14 8 26-4"
        stroke="#FFC600"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CarCard({ car }: { car: InspectedCar }) {
  const dark = car.featured
  const imageSrc = car.image ?? PLACEHOLDER_IMAGE
  return (
    <Link
      href={SAMPLE_REPORT_HREF}
      aria-label={`View a sample inspection report (${car.make} ${car.model})`}
      className={cn(
        'group snap-start flex-shrink-0 rounded-card-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1',
        'w-[78vw] xs:w-[62vw] sm:w-[48vw] md:w-[32vw] lg:w-[18.5%]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        dark
          ? 'bg-background border-2 border-accent shadow-[0_18px_50px_rgba(255,198,0,0.22)]'
          : 'bg-light-surface shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_44px_rgba(15,23,42,0.14)]'
      )}
    >
      <div className={cn('relative aspect-[5/3]', dark ? 'bg-background' : 'bg-light-surface')}>
        <Image
          src={imageSrc}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-contain p-5 md:p-6"
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 32vw, 18vw"
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-1/3',
            dark
              ? 'bg-gradient-to-b from-transparent to-background'
              : 'bg-gradient-to-b from-transparent to-light-surface'
          )}
        />
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
        <h3
          className={cn(
            'font-bold text-lg md:text-xl leading-tight',
            dark ? 'text-accent' : 'text-light-text'
          )}
        >
          {car.make} {car.model}
        </h3>
        <p
          className={cn(
            'text-sm leading-relaxed',
            dark ? 'text-text-secondary' : 'text-light-text-secondary'
          )}
        >
          {car.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-background text-text-primary">
            <Star className="w-3 h-3 text-accent fill-accent" aria-hidden="true" />
            {car.rating}
          </span>
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-background text-text-primary">
            {car.mileage}
          </span>
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-background text-text-primary">
            {car.fuel}
          </span>
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-semibold pt-3 transition-all duration-200 group-hover:gap-2.5',
            dark ? 'text-accent' : 'text-light-text group-hover:text-accent'
          )}
        >
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          View sample report
        </span>
      </div>
    </Link>
  )
}

export function RecentlyInspected() {
  const ref = useReveal<HTMLDivElement>()
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'prev' | 'next') => {
    const el = scrollerRef.current
    if (!el) return
    const amount = el.clientWidth * 0.6 * (dir === 'next' ? 1 : -1)
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section id="recently-inspected" className="bg-light-bg section-padding scroll-mt-24">
      <div ref={ref} className="reveal container-wide">
        <div className="text-center mb-10 md:mb-14">
          <Squiggle />
          <h2 className="text-display-md md:text-display-lg font-bold text-light-text">
            Sample Inspection Reports
          </h2>
          <p className="text-light-text-secondary text-base md:text-lg mt-3 max-w-xl mx-auto">
            Sample, anonymised reports showing the kinds of vehicles we check and
            exactly what your inspection report will look like. Tap any car to preview a report.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll('prev')}
            aria-label="Previous cars"
            className="hidden md:flex absolute -left-2 lg:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-full bg-light-card border border-light-border text-light-text shadow-sm hover:bg-light-surface hover:border-light-border-hover transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll('next')}
            aria-label="Next cars"
            className="hidden md:flex absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-full bg-light-card border border-light-border text-light-text shadow-sm hover:bg-light-surface hover:border-light-border-hover transition-colors"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 pb-2"
          >
            {CARS.map((car) => (
              <CarCard key={`${car.make}-${car.model}`} car={car} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
