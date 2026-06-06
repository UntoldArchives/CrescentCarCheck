import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Camera, CheckCircle2, Clock } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'

export const metadata: Metadata = {
  title: 'Sample Inspection Report',
  description:
    'Preview what a Crescent Car Check inspection report looks like — clear status on every system, photos of every finding, and a plain-English verdict.',
}

const WHAT_TO_EXPECT = [
  {
    Icon: CheckCircle2,
    title: 'Pass / Watch / Fail on every system',
    body: 'A clear verdict on each category — engine, transmission, brakes, body, electrics and more — so nothing is left to guesswork.',
  },
  {
    Icon: Camera,
    title: 'Photos of every finding',
    body: 'No vague claims. Every flagged issue is backed with a photo so you can see exactly what we saw.',
  },
  {
    Icon: FileText,
    title: 'A plain-English summary',
    body: 'A buy / negotiate / avoid recommendation you can hand straight to the seller, delivered the same day.',
  },
]

export default function SampleReportPage() {
  return (
    <>
      <section className="bg-background page-header">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent font-bold tracking-[0.2em] uppercase text-sm">
              Sample Report
            </p>
            <h1 className="text-display-md sm:text-display-lg md:text-display-xl font-black text-text-primary leading-[1.05] md:leading-[1.02] mt-3 break-words">
              See Exactly What You&apos;ll <span className="text-accent">Receive</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg mt-5 max-w-2xl leading-relaxed">
              Every inspection ends with a detailed digital report. We&apos;re putting the
              finishing touches on a downloadable sample you can browse end-to-end — it&apos;ll
              land here shortly. In the meantime, here&apos;s what every report includes.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-light-bg section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHAT_TO_EXPECT.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-light-card rounded-card border border-light-border p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                </div>
                <h2 className="text-light-text font-bold text-lg">{title}</h2>
                <p className="text-light-text-secondary text-sm mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Placeholder for the downloadable sample report */}
          <div className="mt-10 rounded-card-lg border border-dashed border-light-border bg-light-card p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7 text-accent" aria-hidden="true" />
            </div>
            <h2 className="text-light-text text-xl sm:text-2xl font-bold mt-5">
              Full sample report coming soon
            </h2>
            <p className="text-light-text-secondary text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
              A complete, anonymised sample report is on its way. Want to see one sooner, or
              have a specific car in mind? Message us and we&apos;ll walk you through it.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <ButtonLink href="/packages" size="lg" arrow fullWidth className="sm:w-auto">
                View inspection packages
              </ButtonLink>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-button font-semibold px-6 py-3 text-base w-full sm:w-auto bg-light-surface text-light-text border border-light-border hover:border-light-border-hover transition-colors duration-200"
              >
                Ask us a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
