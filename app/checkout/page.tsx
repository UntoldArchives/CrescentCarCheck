import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Loader2 } from 'lucide-react'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export const metadata: Metadata = {
  title: 'Book Your Inspection',
  description:
    'Book a Crescent Car Check pre-purchase inspection. Tell us about the car, where it is, and when you want us there.',
}

export default function CheckoutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-background page-header">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-display-md sm:text-display-lg md:text-display-xl font-black text-text-primary leading-[1.05] md:leading-[1.02] break-words">
              A Few Details and We&apos;ll See You at the Car
            </h1>
            <p className="text-text-secondary text-base md:text-lg mt-5 max-w-2xl leading-relaxed">
              Share the vehicle, the location, and a time window that suits you. We&apos;ll
              confirm a slot and head straight to the car — no hidden steps.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-light-bg section-padding">
        <div className="container-wide">
          <Suspense fallback={<CheckoutFallback />}>
            <CheckoutForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}

function CheckoutFallback() {
  return (
    <div className="flex items-center justify-center py-16 text-light-text-muted">
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      <span className="ml-2 text-sm">Loading the booking form…</span>
    </div>
  )
}
