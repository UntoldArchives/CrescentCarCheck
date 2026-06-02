import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'

const TRUST_ITEMS = ['Certified Inspectors', 'Same-Day Slots', 'Instant Reports']

export function HeroSection() {
  return (
    <section className="relative min-h-[58svh] sm:min-h-[80svh] lg:min-h-[100svh] flex items-center overflow-hidden bg-background">
      {/* Full-bleed inspector photo */}
      <Image
        src="/Banner.png"
        alt="Crescent Car Check inspector examining a vehicle on-site"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[center_38%]"
      />

      {/* Readability scrim — darkens the photo so the bubble and text read on any crop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/45 lg:bg-gradient-to-r lg:from-black/30 lg:via-black/15 lg:to-black/70"
      />

      {/* Content */}
      <div className="relative z-10 container-wide w-full pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-12">
        <div className="lg:flex lg:justify-end">
          <div className="bg-accent text-background rounded-card-lg p-5 sm:p-9 lg:p-10 shadow-2xl w-full max-w-sm sm:max-w-xl lg:w-[46%]">
            <h1 className="text-2xl sm:text-4xl lg:text-4xl xl:text-5xl font-black leading-[1.1] sm:leading-[1.08]">
              Buy With Confidence and Avoid Hidden Surprises!
            </h1>
            <p className="text-background/80 text-sm sm:text-base mt-2.5 sm:mt-4 leading-relaxed">
              We help used car buyers avoid costly mistakes by uncovering hidden damage,
              mechanical defects, accident history, fault codes and more — so you know
              exactly what you&apos;re buying before you pay.
            </p>

            <div className="mt-5 sm:mt-6">
              <ButtonLink
                href="/checkout?package=comprehensive"
                size="lg"
                arrow
                fullWidth
                className="xs:w-auto bg-background text-accent hover:bg-background/90"
              >
                Book Inspection
              </ButtonLink>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 pt-4 sm:mt-6 sm:pt-5 border-t border-background/15">
              {TRUST_ITEMS.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-background/90"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
