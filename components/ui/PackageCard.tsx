'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import { Package } from '@/types/booking'
import { cn } from '@/lib/utils'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { Button } from './Button'

interface PackageCardProps {
  pkg: Package
  variant?: 'compact' | 'full'
  onSelect?: (pkg: Package) => void
  selected?: boolean
  linkHref?: string
}

function FeatureRow({ feature }: { feature: string }) {
  const isInheritance = feature.startsWith('Everything in')
  return (
    <li className="flex items-start gap-2">
      {isInheritance ? (
        <ChevronRight className="w-3.5 h-3.5 text-accent mt-1 flex-shrink-0" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-1 flex-shrink-0" aria-hidden="true" />
      )}
      <span
        className={cn(
          'text-sm',
          isInheritance
            ? 'text-text-primary font-semibold'
            : 'text-text-secondary'
        )}
      >
        {feature}
      </span>
    </li>
  )
}

function PackageCardComponent({
  pkg,
  variant = 'full',
  onSelect,
  selected = false,
  linkHref,
}: PackageCardProps) {
  const isCompact = variant === 'compact'
  const visibleFeatures = isCompact ? pkg.features.slice(0, 5) : pkg.features
  const remaining = pkg.features.length - visibleFeatures.length

  const handleCtaClick = () => {
    trackEvent(GA_EVENTS.SELECT_PACKAGE, {
      package_name: pkg.name,
      package_price: pkg.price,
    })
    onSelect?.(pkg)
  }

  return (
    <div
      className={cn(
        'relative rounded-card border p-6 flex flex-col transition-all duration-300',
        pkg.popular
          ? 'bg-card border-accent shadow-card-hover md:-mt-2 md:pb-8 z-10'
          : 'bg-card border-border hover:border-border-hover',
        selected && 'border-accent bg-accent-muted'
      )}
    >
      {pkg.popular && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-background text-xs font-bold px-3 py-1 rounded-full">
          {pkg.badge ?? 'Most Popular'}
        </span>
      )}

      <h3 className="text-display-xs font-bold text-text-primary">{pkg.name}</h3>
      <p className="text-text-secondary text-sm mt-1">{pkg.tagline}</p>

      <div className="mt-5">
        <div className="flex items-end gap-1.5 flex-wrap">
          <span className="text-text-secondary text-sm font-medium pb-1.5">AED</span>
          <span className="text-4xl font-black text-text-primary leading-none">
            {pkg.price}
          </span>
          {/* Price varies by emirate (travel fee), so the card shows a "from" price. */}
          <span className="text-text-muted text-xs font-medium pb-1.5">onwards</span>
        </div>
        <span className="inline-block mt-3 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-tag">
          {pkg.inspectionPoints} point check
        </span>
      </div>

      <ul className="space-y-2.5 mt-6 flex-1">
        {visibleFeatures.map((feature, i) => (
          <FeatureRow key={i} feature={feature} />
        ))}
        {isCompact && remaining > 0 && (
          <li className="pt-1">
            <Link
              href="/packages"
              className="text-sm font-semibold text-accent hover:underline"
            >
              + {remaining} more checks, see full plan →
            </Link>
          </li>
        )}
      </ul>

      <div className="mt-6">
        {linkHref ? (
          <Link
            href={linkHref}
            onClick={handleCtaClick}
            className={cn(
              'inline-flex items-center justify-center gap-2 w-full rounded-button font-semibold px-6 py-3 text-base transition-all duration-200',
              pkg.popular
                ? 'bg-accent text-background hover:bg-accent-hover'
                : 'bg-card text-text-primary border border-border hover:border-border-hover hover:bg-card-hover'
            )}
          >
            <span className="truncate">{pkg.ctaLabel}</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          </Link>
        ) : (
          <Button
            variant={pkg.popular ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
            arrow
            onClick={handleCtaClick}
          >
            {pkg.ctaLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export const PackageCard = memo(PackageCardComponent)
