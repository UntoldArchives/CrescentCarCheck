export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Crescent Car Checks',
    description: 'Professional pre-purchase car inspection service across the UAE.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE,
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressRegion: 'Sharjah',
    },
    areaServed: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    priceRange: 'AED 249 to AED 449',
    openingHours: 'Mo-Su 09:00-20:00',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Car Inspection Packages',
      itemListElement: [
        { '@type': 'Offer', name: 'Standard Inspection', price: '249', priceCurrency: 'AED' },
        { '@type': 'Offer', name: 'Comprehensive Inspection', price: '349', priceCurrency: 'AED' },
        { '@type': 'Offer', name: 'Premium Inspection', price: '449', priceCurrency: 'AED' },
      ],
    },
  }
}
