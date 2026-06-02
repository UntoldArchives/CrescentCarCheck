'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type CellValue = boolean | string

interface Column {
  name: string
  price: string
  id: 'standard' | 'comprehensive' | 'premium'
  popular: boolean
}

interface Row {
  label: string
  values: [CellValue, CellValue, CellValue]
}

const COLUMNS: readonly Column[] = [
  { name: 'Standard', price: 'AED 249', id: 'standard', popular: false },
  { name: 'Comprehensive', price: 'AED 349', id: 'comprehensive', popular: true },
  { name: 'Premium', price: 'AED 449', id: 'premium', popular: false },
] as const

const ROWS: readonly Row[] = [
  {
    label: 'Best for',
    values: [
      'Everyday used cars',
      'Buyers who want extra confidence',
      'High-value or luxury purchases',
    ],
  },
  { label: 'Inspection points', values: ['250+', '400+', '600+'] },
  { label: 'Exterior visual inspection', values: [true, true, true] },
  { label: 'Interior condition check', values: [true, true, true] },
  { label: 'Exterior paint meter checks', values: [true, true, true] },
  { label: 'OBD diagnostic scan', values: [true, true, 'Extended fault-code review'] },
  { label: 'Battery health check', values: [true, true, 'Battery & electrical system review'] },
  { label: 'AC temperature check', values: [true, true, 'AC compressor check'] },
  { label: 'Tyres condition check', values: [true, true, true] },
  { label: 'Rims & brakes visual check', values: [true, true, true] },
  { label: 'Exterior lights & brake lights', values: [true, true, true] },
  { label: 'Engine bay visual inspection', values: [true, true, 'Detailed engine bay inspection'] },
  { label: 'Visible fluid leak check', values: ['Basic', 'Detailed', 'Detailed engine & fluid leak check'] },
  { label: 'Accident history check', values: [true, true, true] },
  { label: 'Full underbody inspection', values: [false, true, true] },
  { label: 'Photos of visible faults', values: [false, true, true] },
  { label: 'Panel gaps check', values: [false, true, true] },
  { label: 'Suspension visual check', values: [false, true, true] },
  { label: 'Road-test observations', values: [false, 'Where possible', 'Where possible'] },
  { label: 'Detailed photo report', values: [false, true, true] },
  { label: 'Buy / negotiate / avoid recommendation', values: [false, true, true] },
  { label: 'Endoscopic camera check', values: [false, false, true] },
  { label: 'Transmission check', values: [false, false, true] },
  { label: '20-minute inspector summary call', values: [false, false, true] },
  { label: 'Price negotiation notes', values: [false, false, true] },
] as const

const FEATURE_ROWS = ROWS.slice(2)

function Cell({ value, popular }: { value: CellValue; popular: boolean }) {
  if (value === true) {
    return (
      <Check
        className={cn('w-5 h-5 mx-auto', popular ? 'text-accent' : 'text-success')}
        aria-label="Included"
      />
    )
  }
  if (value === false) {
    return (
      <Minus
        className="w-4 h-4 mx-auto text-light-text-muted/50"
        aria-label="Not included"
      />
    )
  }
  return (
    <span className="block text-light-text text-xs sm:text-sm leading-snug">
      {value}
    </span>
  )
}

/** Mobile view: pick a package, read its full feature list top-to-bottom. */
function MobileComparison() {
  const [active, setActive] = useState(1) // Comprehensive by default
  const col = COLUMNS[active]
  const bestFor = ROWS[0].values[active]
  const points = ROWS[1].values[active]

  return (
    <div className="md:hidden">
      <div
        role="tablist"
        aria-label="Choose a package to view its checklist"
        className="grid grid-cols-3 gap-1.5 p-1 rounded-card bg-light-surface border border-light-border"
      >
        {COLUMNS.map((c, i) => {
          const selected = i === active
          return (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={cn(
                'rounded-[10px] py-2 px-1 text-center transition-colors duration-150',
                selected
                  ? c.popular
                    ? 'bg-accent text-background shadow-sm'
                    : 'bg-light-card text-light-text border border-light-border shadow-sm'
                  : 'text-light-text-muted hover:text-light-text'
              )}
            >
              <span className="block text-xs font-bold leading-tight">{c.name}</span>
              <span className="block text-[10px] font-medium opacity-80 mt-0.5">{c.price}</span>
            </button>
          )
        })}
      </div>

      <div
        className={cn(
          'mt-4 rounded-card-lg border bg-light-card p-5',
          col.popular ? 'border-accent' : 'border-light-border'
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={cn('text-lg font-bold', col.popular ? 'text-accent' : 'text-light-text')}>
              {col.name}
            </p>
            <p className="text-light-text-muted text-sm font-medium">{col.price}</p>
          </div>
          {col.popular && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full">
              Recommended
            </span>
          )}
        </div>

        <dl className="mt-4 rounded-card bg-light-bg border border-light-border px-3.5 py-3 text-sm space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-light-text-muted">Best for</dt>
            <dd className="text-light-text font-medium text-right">{bestFor}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-light-text-muted">Inspection points</dt>
            <dd className="text-light-text font-bold">{points}</dd>
          </div>
        </dl>

        <ul className="mt-4 space-y-2.5">
          {FEATURE_ROWS.map((row) => {
            const v = row.values[active]
            const included = v !== false
            return (
              <li key={row.label} className="flex items-start gap-2.5">
                {included ? (
                  <Check
                    className={cn('w-4 h-4 mt-0.5 flex-shrink-0', col.popular ? 'text-accent' : 'text-success')}
                    aria-hidden="true"
                  />
                ) : (
                  <Minus className="w-4 h-4 mt-0.5 flex-shrink-0 text-light-text-muted/50" aria-hidden="true" />
                )}
                <span className={cn('text-sm leading-snug', included ? 'text-light-text' : 'text-light-text-muted')}>
                  {row.label}
                  {typeof v === 'string' && (
                    <span className="block text-light-text-muted text-xs mt-0.5">{v}</span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>

        <Link
          href={`/checkout?package=${col.id}`}
          className={cn(
            'mt-6 inline-flex items-center justify-center gap-1.5 w-full rounded-button font-semibold text-sm px-4 py-3 transition-colors duration-200',
            col.popular
              ? 'bg-accent text-background hover:bg-accent-hover'
              : 'bg-light-surface text-light-text border border-light-border hover:border-light-border-hover'
          )}
        >
          Choose {col.name}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export function ComparisonTable({ topSpacing = true }: { topSpacing?: boolean }) {
  return (
    <div className={cn(topSpacing && 'mt-20 md:mt-28')}>
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
        <h2 className="text-display-sm md:text-display-md font-bold text-light-text">
          Compare Every Feature
        </h2>
        <p className="text-light-text-secondary text-base md:text-lg mt-3">
          A line-by-line look at what each package includes.
        </p>
      </div>

      {/* Mobile: tabbed single-package checklist */}
      <MobileComparison />

      {/* Tablet / desktop: full side-by-side table */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide bg-light-card rounded-card-lg border border-light-border">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">
            Feature comparison across Standard, Comprehensive and Premium
            inspection packages
          </caption>
          <thead>
            <tr className="border-b border-light-border">
              <th
                scope="col"
                className="bg-light-card text-[10px] uppercase tracking-widest text-light-text-muted font-semibold px-5 py-4 w-[32%]"
              >
                Feature
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    'px-4 py-4 text-center align-bottom',
                    col.popular && 'bg-accent/5'
                  )}
                >
                  <span
                    className={cn(
                      'block text-base font-bold',
                      col.popular ? 'text-accent' : 'text-light-text'
                    )}
                  >
                    {col.name}
                  </span>
                  <span className="block text-light-text-muted text-xs mt-1 font-medium">
                    {col.price}
                  </span>
                  {col.popular && (
                    <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-widest text-accent">
                      Recommended
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.label}
                className="border-b border-light-border last:border-b-0"
              >
                <th
                  scope="row"
                  className="bg-light-card text-light-text text-sm font-semibold px-5 py-4 align-middle"
                >
                  {row.label}
                </th>
                {row.values.map((val, i) => (
                  <td
                    key={i}
                    className={cn(
                      'text-center px-4 py-4 align-middle',
                      COLUMNS[i].popular && 'bg-accent/5'
                    )}
                  >
                    <Cell value={val} popular={COLUMNS[i].popular} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-light-border bg-light-surface">
              <th
                scope="row"
                className="bg-light-surface text-light-text-muted text-[10px] uppercase tracking-widest font-semibold px-5 py-4"
              >
                Get started
              </th>
              {COLUMNS.map((col) => (
                <td
                  key={col.id}
                  className={cn(
                    'px-4 py-4 text-center',
                    col.popular && 'bg-accent/5'
                  )}
                >
                  <Link
                    href={`/checkout?package=${col.id}`}
                    className={cn(
                      'inline-flex items-center justify-center gap-1.5 rounded-button font-semibold text-sm px-4 py-2 transition-colors duration-200',
                      col.popular
                        ? 'bg-accent text-background hover:bg-accent-hover'
                        : 'bg-light-card text-light-text border border-light-border hover:border-light-border-hover'
                    )}
                  >
                    Choose
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
