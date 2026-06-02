import type { Metadata } from 'next'
import Image from 'next/image'
import { ShieldCheck, SearchCheck, Zap, Award, CheckCircle2 } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { StatsSection } from '@/components/home/StatsSection'
import { CTABanner } from '@/components/home/CTABanner'
import { BrandsCovered } from '@/components/about/BrandsCovered'
import { EmiratesCovered } from '@/components/about/EmiratesCovered'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Crescent Car Checks helps UAE buyers purchase used cars with confidence. Learn about our inspectors, our values, and why we do what we do.',
}

const VALUES = [
  {
    num: '01',
    Icon: ShieldCheck,
    title: 'Honesty First',
    text: 'We report exactly what we find. No sugar-coating, no pressure, no hidden agenda. Just the truth about the car.',
  },
  {
    num: '02',
    Icon: SearchCheck,
    title: 'Genuine Thoroughness',
    text: 'Up to 600 inspection points checked on every vehicle, with clear photos of every fault we uncover.',
  },
  {
    num: '03',
    Icon: Zap,
    title: 'Speed Without Shortcuts',
    text: 'A detailed digital report reaches you the moment the inspection ends, never at the cost of accuracy.',
  },
  {
    num: '04',
    Icon: Award,
    title: 'Hands-On Expertise',
    text: 'Experienced automotive specialists with years of hands-on work across all makes and models.',
  },
]

const PROMISE = [
  'On-site inspection at the seller’s location, anywhere in the UAE',
  'Independent, unbiased assessment with no ties to any seller',
  'Photographic evidence of every fault found',
  'A clear digital report you can use to negotiate with confidence',
]

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-background page-header">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-display-md sm:text-display-lg md:text-display-xl font-black text-text-primary leading-[1.05] md:leading-[1.02] break-words">
              We Help You Buy <span className="text-accent">Used Cars</span> With <span className="text-accent">Total Confidence</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg mt-5 max-w-2xl leading-relaxed">
              Crescent Car Checks is an independent pre-purchase car inspection
              service operating across the Emirates. We exist for one reason: to make
              sure you know exactly what you are buying.
            </p>
          </div>

          <div className="relative rounded-card-lg overflow-hidden mt-12 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
            <Image
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=85"
              alt="Crescent Car Checks inspector at work"
              width={1600}
              height={720}
              priority
              quality={88}
              sizes="100vw"
              className="w-full object-cover aspect-[21/9]"
            />
          </div>
        </div>
      </section>

      {/* Brands we inspect — sits between the dark hero and the light Story
          so it provides a subtle dark→darker shift before the bright break. */}
      <BrandsCovered />

      {/* Our Story */}
      <section className="bg-light-bg section-padding">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-card-lg overflow-hidden order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
              alt="Inspector examining a vehicle"
              width={900}
              height={675}
              loading="lazy"
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-display-sm md:text-display-md font-bold text-light-text">
              Why We Built Crescent Car Checks
            </h2>
            <p className="text-light-text-secondary leading-relaxed mt-4">
              Buying a used car in the UAE should not feel like a gamble. Yet every
              year thousands of buyers discover hidden accident damage, flood
              history, or worn-out mechanicals only after the money has changed
              hands.
            </p>
            <p className="text-light-text-secondary leading-relaxed mt-4">
              We started Crescent Car Checks to put the truth back in the buyer&apos;s
              hands. Our inspectors travel to wherever the car is, run a meticulous
              multi-point check, and hand you a clear digital report so you know
              exactly what you are paying for.
            </p>

            <ul className="space-y-3 mt-6">
              {PROMISE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-light-text-secondary text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ButtonLink href="/packages" size="lg" arrow>
                See Our Packages
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface section-padding">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="text-display-sm md:text-display-md font-bold text-text-primary">
              The Values Behind Every Inspection
            </h2>
            <p className="text-text-secondary text-base md:text-lg mt-3">
              These are the principles our inspectors carry to every single car.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {VALUES.map(({ num, Icon, title, text }) => (
              <div
                key={num}
                className="relative bg-card rounded-card border border-border p-6 hover:border-border-hover hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className="absolute top-5 right-5 text-3xl font-black text-border select-none"
                  aria-hidden="true"
                >
                  {num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-accent-muted border border-accent/20 flex items-center justify-center mb-4">
                  <Icon className="text-accent w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-text-primary font-bold text-lg">{title}</h3>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emirates covered — light break after the dark Values block */}
      <EmiratesCovered />

      {/* Stats + CTA reused from the homepage */}
      <StatsSection />
      <CTABanner />
    </>
  )
}
