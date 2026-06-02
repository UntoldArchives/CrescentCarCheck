'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, Camera, CheckCircle2, FileText } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'
import { ButtonLink } from '@/components/ui/ButtonLink'

const REPORT_CATEGORIES = [
  { label: 'Engine & Performance', status: 'pass' as const, note: 'No leaks · compression within spec' },
  { label: 'Transmission', status: 'pass' as const, note: 'Smooth shifts · fluid clean' },
  { label: 'Brakes & Suspension', status: 'pass' as const, note: 'Pads 60% · shocks healthy' },
  { label: 'Body & Paint', status: 'watch' as const, note: 'Minor respray on rear quarter' },
  { label: 'Electrical & Electronics', status: 'pass' as const, note: 'All systems responsive' },
  { label: 'Interior & Comfort', status: 'pass' as const, note: 'No wear beyond mileage' },
  { label: 'Tyres & Wheels', status: 'watch' as const, note: 'Front pair near replacement' },
  { label: 'Underbody & Frame', status: 'pass' as const, note: 'No accident damage detected' },
]

export function SampleReport() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="bg-light-bg section-padding">
      <div
        ref={ref}
        className="reveal container-wide grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        <div>
          <h2 className="text-display-sm md:text-display-md font-bold text-light-text">
            See Exactly What You&apos;re Buying
          </h2>
          <p className="text-light-text-secondary leading-relaxed mt-4">
            Every inspection ends with a detailed digital report: clear status on every system,
            photos of anything worth flagging, and a plain-English summary you can hand straight to
            the seller. Delivered the same day.
          </p>

          <ul className="space-y-3 mt-6">
            <li className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span className="text-light-text-secondary">
                <span className="font-semibold text-light-text">PDF + web report</span>, shareable,
                printable, searchable.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span className="text-light-text-secondary">
                <span className="font-semibold text-light-text">Photos of every finding</span>, no
                vague claims, just evidence.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span className="text-light-text-secondary">
                <span className="font-semibold text-light-text">Pass / Watch / Fail</span> on every
                category, no guesswork.
              </span>
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="/checkout?package=comprehensive" size="lg" arrow>
              Book to Get Your Report
            </ButtonLink>
            <Link
              href="/packages"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-light-text hover:text-accent hover:gap-2.5 transition-all duration-200"
            >
              See what&apos;s included
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-accent/10 rounded-card-lg blur-2xl" aria-hidden="true" />
          <div
            className="relative bg-light-card border border-light-border rounded-card-lg shadow-[0_24px_60px_rgba(0,0,0,0.12)] overflow-hidden"
            role="img"
            aria-label="Sample inspection report preview"
          >
            <div className="bg-background text-text-primary px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.18em] text-accent font-semibold truncate">
                  CRESCENT CAR CHECKS
                </p>
                <p className="font-bold text-sm sm:text-base mt-0.5 truncate">Vehicle Inspection Report</p>
              </div>
              <span className="text-[10px] text-text-secondary tracking-wider flex-shrink-0">SAMPLE</span>
            </div>

            <div className="px-5 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-light-border">
              {[
                ['Make', 'Mercedes'],
                ['Model', 'S-Class'],
                ['Year', '2021'],
                ['VIN', 'WDD••••••'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] uppercase tracking-widest text-light-text-muted">{k}</p>
                  <p className="text-light-text font-semibold text-sm mt-1">{v}</p>
                </div>
              ))}
            </div>

            <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3 bg-success-muted border-b border-light-border">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-light-text-muted">
                  Overall Verdict
                </p>
                <p className="text-success font-bold text-base sm:text-lg mt-0.5 truncate">Recommended to Buy</p>
              </div>
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-success flex-shrink-0" aria-hidden="true" />
            </div>

            <div className="px-5 sm:px-6 py-5 space-y-2.5">
              {REPORT_CATEGORIES.map((cat) => {
                const isPass = cat.status === 'pass'
                return (
                  <div
                    key={cat.label}
                    className="flex items-center justify-between gap-3 py-2 border-b border-light-border last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-light-text font-semibold text-sm truncate">{cat.label}</p>
                      <p className="text-light-text-muted text-xs truncate">{cat.note}</p>
                    </div>
                    <span
                      className={
                        'inline-flex items-center gap-1 px-2 py-1 rounded-tag text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ' +
                        (isPass
                          ? 'bg-success-muted text-success'
                          : 'bg-warning-muted text-warning')
                      }
                    >
                      {isPass ? (
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                      )}
                      {isPass ? 'Pass' : 'Watch'}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="px-5 sm:px-6 py-3 bg-light-surface text-light-text-muted text-[10px] flex items-center justify-between gap-3 border-t border-light-border">
              <span className="truncate">Sample preview</span>
              <span className="flex-shrink-0">Page 1 of 24</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
