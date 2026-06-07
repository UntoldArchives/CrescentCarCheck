import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Logo } from './Logo'

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+971 502526314'
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'crescentcarcheck@gmail.com'
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971502526314'
// Optional — only rendered once the client provides a real handle, so we never
// ship a dead href="#" link that just jumps to the top of the page.
const INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM_URL || ''

const SERVICES = [
  { href: '/packages', label: 'Pre-Purchase Inspection' },
  { href: '/packages', label: 'Comprehensive Check' },
  { href: '/packages', label: 'Premium Inspection' },
]

const COMPANY = [
  { href: '/about', label: 'About Us' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/contact', label: 'Contact' },
]

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  )
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.247 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

const linkClass =
  'text-text-secondary text-sm hover:text-text-primary transition-colors duration-200'
const headingClass =
  'text-xs font-semibold tracking-widest text-text-muted mb-4'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container-wide py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-text-secondary text-sm mt-4 max-w-xs">
              Independent pre-purchase car inspections, on-site across the UAE.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {INSTAGRAM && (
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-text-primary hover:bg-accent hover:text-background hover:border-accent transition-colors duration-200"
                >
                  <InstagramGlyph className="w-4 h-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-text-primary hover:bg-accent hover:text-background hover:border-accent transition-colors duration-200"
              >
                <WhatsAppGlyph className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className={headingClass}>SERVICES</h3>
            <ul className="space-y-3">
              {SERVICES.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>COMPANY</h3>
            <ul className="space-y-3">
              {COMPANY.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>CONTACT</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${PHONE}`} className={`${linkClass} flex items-center gap-2`}>
                  <Phone className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                  {PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className={`${linkClass} flex items-center gap-2`}>
                  <Mail className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                  {EMAIL}
                </a>
              </li>
              <li className="text-text-secondary text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                Sharjah, UAE
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-sm">
            © 2026 Crescent Car Check. All rights reserved.
          </p>
          <p className="text-text-muted text-sm">
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">
              Privacy
            </Link>
            <span className="mx-2">·</span>
            <Link href="/terms" className="hover:text-text-secondary transition-colors">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
