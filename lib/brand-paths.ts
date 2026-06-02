/**
 * Brand glyph paths sourced from the simple-icons package (MIT licensed,
 * https://github.com/simple-icons/simple-icons). Brand logos are trademarks
 * of their respective owners and are used here descriptively to indicate the
 * makes we inspect; see the disclaimer in the BrandsCovered component.
 *
 * Each entry's `path` is the SVG path data for a 24x24 viewBox. Brands not
 * available in simple-icons (Mercedes-Benz, Lexus, Land Rover) are rendered
 * via the `wordmark` fallback instead of an icon glyph.
 */

export type BrandPath = {
  name: string
  href: string
  slug: string
  /** simple-icons SVG path data (24x24 viewBox). */
  path?: string
  /** Path under /public for a brand-supplied SVG. Takes precedence over `path` and `wordmark`. */
  imageSrc?: string
  /** Text wordmark fallback when no logo is available. */
  wordmark?: string
}

import { toyota, nissan, bmw, audi, porsche, ford, chevrolet, hyundai, kia, honda, mitsubishi, tesla } from './brand-paths-data'

export const BRANDS: readonly BrandPath[] = [
  { name: 'Toyota', href: 'https://www.toyota.ae/', slug: 'toyota', path: toyota },
  { name: 'Nissan', href: 'https://www.nissan-me.com/en-AE/', slug: 'nissan', path: nissan },
  { name: 'Mercedes-Benz', href: 'https://www.mercedes-benz.ae/', slug: 'mercedes-benz', imageSrc: '/brands/Mercedes.png', wordmark: 'Mercedes-Benz' },
  { name: 'BMW', href: 'https://www.bmw.ae/', slug: 'bmw', path: bmw },
  { name: 'Audi', href: 'https://www.audi.ae/', slug: 'audi', path: audi },
  { name: 'Lexus', href: 'https://www.lexus.ae/', slug: 'lexus', imageSrc: '/brands/lexus.svg', wordmark: 'LEXUS' },
  { name: 'Land Rover', href: 'https://www.landrover.ae/', slug: 'land-rover', imageSrc: '/brands/LandRover.png', wordmark: 'LAND ROVER' },
  { name: 'Porsche', href: 'https://www.porsche.com/middle-east/', slug: 'porsche', path: porsche },
  { name: 'Ford', href: 'https://www.ford.ae/', slug: 'ford', path: ford },
  { name: 'Chevrolet', href: 'https://www.chevroletarabia.com/ae/en.html', slug: 'chevrolet', path: chevrolet },
  { name: 'Hyundai', href: 'https://www.hyundai.com/ae/', slug: 'hyundai', path: hyundai },
  { name: 'Kia', href: 'https://www.kia.com/ae/', slug: 'kia', path: kia },
  { name: 'Honda', href: 'https://www.honda-uae.com/', slug: 'honda', path: honda },
  { name: 'Mitsubishi', href: 'https://www.mitsubishi-motors.ae/', slug: 'mitsubishi', path: mitsubishi },
  { name: 'Tesla', href: 'https://www.tesla.com/en_AE', slug: 'tesla', path: tesla },
] as const
