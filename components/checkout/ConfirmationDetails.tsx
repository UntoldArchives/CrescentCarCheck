'use client'

import { useSearchParams } from 'next/navigation'
import { PACKAGES, travelFeeForEmirate } from '@/lib/packages'
import type { Emirate, PackageId } from '@/types/booking'

function isValidPackageId(s: string): s is PackageId {
  return s === 'standard' || s === 'comprehensive' || s === 'premium'
}

export function ConfirmationDetails() {
  const search = useSearchParams()
  const id = search.get('id')
  const pkgParam = search.get('package') ?? ''
  const pkg = isValidPackageId(pkgParam) ? PACKAGES.find((p) => p.id === pkgParam) : undefined

  // travelFeeForEmirate guards with an includes() check, so an unknown value
  // from the query string safely yields a 0 fee.
  const emirate = (search.get('emirate') ?? '') as Emirate | ''
  const travelFee = pkg ? travelFeeForEmirate(emirate) : 0
  const total = pkg ? pkg.price + travelFee : 0

  if (!id && !pkg) return null

  return (
    <div
      className="
        mt-8 inline-flex flex-wrap items-center gap-x-6 gap-y-3
        bg-card rounded-card border border-border
        px-5 py-3.5
      "
    >
      {id && (
        <div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
            Reference
          </p>
          <p className="text-text-primary font-mono text-sm mt-0.5">{id}</p>
        </div>
      )}
      {pkg && (
        <div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
            Package
          </p>
          <p className="text-text-primary font-semibold text-sm mt-0.5">
            {pkg.name} · AED {total}
            {travelFee > 0 ? (
              <span className="text-text-muted font-normal"> (incl. AED {travelFee} travel)</span>
            ) : null}
          </p>
        </div>
      )}
    </div>
  )
}
