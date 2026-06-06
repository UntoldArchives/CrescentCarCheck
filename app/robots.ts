import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://crescentcarcheck.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /confirmation carries a booking reference and is already noindex; /api
      // holds only POST endpoints — neither belongs in search results.
      disallow: ['/api/', '/confirmation'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
