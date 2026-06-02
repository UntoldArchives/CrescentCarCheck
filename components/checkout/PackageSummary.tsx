'use client'

import Link from 'next/link'
import { Check, ShieldCheck, FileText, MapPin } from 'lucide-react'
import type { Package } from '@/types/booking'

interface PackageSummaryProps {
  pkg: Package
}

const TRUST_POINTS = [
  { Icon: MapPin, text: 'On-site at the seller’s location' },
  { Icon: FileText, text: 'Digital report delivered the same day' },
  { Icon: ShieldCheck, text: 'Independent — no ties to any seller' },
] as const

export function PackageSummary({ pkg }: PackageSummaryProps) {
  return (
    <aside
      className="
        bg-light-card rounded-card-lg border border-light-border
        shadow-[0_8px_24px_rgba(0,0,0,0.06)]
        p-5 sm:p-6
      "
      aria-label="Order summary"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-light-text font-bold text-lg">{pkg.name}</h2>
        {pkg.popular && (
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Most Popular
          </span>
        )}
      </div>
      <p className="text-light-text-secondary text-sm mt-1 leading-snug">{pkg.tagline}</p>

      <div className="mt-4 flex items-end justify-between gap-3 pb-4 border-b border-light-border">
        <div>
          <p className="text-xs text-light-text-muted uppercase tracking-wider font-semibold">
            Total today
          </p>
          <p className="text-light-text text-3xl font-black leading-none mt-1">
            AED {pkg.price}
          </p>
          <p className="text-xs text-light-text-muted mt-1">Inclusive of VAT</p>
        </div>
        <Link
          href="/packages"
          className="text-xs font-semibold text-accent hover:underline whitespace-nowrap"
        >
          Change package
        </Link>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-light-text-secondary uppercase tracking-wider mb-2">
          {pkg.inspectionPoints} inspection points
        </p>
        <ul className="space-y-1.5">
          {pkg.features.slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-light-text-secondary">
              <Check className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span className="leading-snug">{f}</span>
            </li>
          ))}
          {pkg.features.length > 5 && (
            <li className="text-xs text-light-text-muted pl-5">
              +{pkg.features.length - 5} more checks
            </li>
          )}
        </ul>
      </div>

      <div className="mt-5 pt-5 border-t border-light-border space-y-2">
        {TRUST_POINTS.map(({ Icon, text }) => (
          <p
            key={text}
            className="text-light-text-muted text-xs flex items-start gap-2 leading-snug"
          >
            <Icon className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{text}</span>
          </p>
        ))}
      </div>
    </aside>
  )
}
