import { Metadata } from 'next'
import Script from 'next/script'
import { getLocalBusinessSchema } from '@/lib/structured-data'
import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { WhyInspectionMatters } from '@/components/home/WhyInspectionMatters'
import { PackagesSection } from '@/components/home/PackagesSection'
import { HowItWorks } from '@/components/home/HowItWorks'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { InspectionHighlights } from '@/components/home/InspectionHighlights'
import { SampleReport } from '@/components/home/SampleReport'
import { ComparisonTable } from '@/components/packages/ComparisonTable'
import { RecentlyInspected } from '@/components/home/RecentlyInspected'
import { Testimonials } from '@/components/home/Testimonials'
import { FAQ } from '@/components/home/FAQ'
import { CTABanner } from '@/components/home/CTABanner'

export const metadata: Metadata = {
  title: 'Professional Car Inspections in UAE',
}

export default function HomePage() {
  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
      />
      <HeroSection />
      <PackagesSection />
      <HowItWorks />
      <WhyInspectionMatters />
      <TrustBar />
      <InspectionHighlights />
      <SampleReport />
      <section className="bg-light-bg section-padding">
        <div className="container-wide">
          <ComparisonTable topSpacing={false} />
        </div>
      </section>
      <WhyChooseUs />
      <RecentlyInspected />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  )
}
