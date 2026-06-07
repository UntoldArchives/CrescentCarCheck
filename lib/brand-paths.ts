/**
 * Brand glyph paths sourced from the simple-icons package (MIT licensed,
 * https://github.com/simple-icons/simple-icons). Brand logos are trademarks
 * of their respective owners and are used here descriptively to indicate the
 * makes we inspect; see the disclaimer in the BrandsCovered component.
 *
 * Each entry's `path` is the SVG path data for a 24x24 viewBox. Brands not
 * available in simple-icons (Mercedes-Benz, Lexus, Land Rover, Dodge) are
 * rendered via an `imageSrc` SVG/PNG asset under /public/brands, with a
 * `wordmark` text fallback if the asset fails to load.
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
  /** Optional visual scale multiplier for the glyph (e.g. 1.2 = 20% larger). */
  scale?: number
  /**
   * Tailwind filter utility applied to an `imageSrc` logo. Defaults to
   * whitening (`brightness(0) invert(1)`), which flattens a logo to solid
   * white — ideal for simple monochrome marks. Two-tone logos (e.g. Dodge's
   * black ram on a white shield) should override with `[filter:invert(1)]`
   * so the colour relationship is preserved.
   */
  imageFilter?: string
}

import { toyota, nissan, bmw, audi, porsche, ford, chevrolet, hyundai, honda, mitsubishi, tesla, ferrari, bentley, rollsRoyce } from './brand-paths-data'

export const BRANDS: readonly BrandPath[] = [
  { name: 'Toyota', href: 'https://www.toyota.ae/en/', slug: 'toyota', path: toyota },
  { name: 'Nissan', href: 'https://www.nissan-me.com/', slug: 'nissan', path: nissan },
  { name: 'Mercedes-Benz', href: 'https://www.mercedes-benz-mena.com/dubai/en/', slug: 'mercedes-benz', imageSrc: '/brands/Mercedes.png', wordmark: 'Mercedes-Benz' },
  { name: 'BMW', href: 'https://www.bmw-dubai.com/', slug: 'bmw', path: bmw },
  { name: 'Audi', href: 'https://www.audi-dubai.com/en/', slug: 'audi', path: audi },
  { name: 'Lexus', href: 'https://www.lexus.ae/en/', slug: 'lexus', imageSrc: '/brands/lexus.svg', wordmark: 'LEXUS' },
  { name: 'Land Rover', href: 'https://www.landrover-uae.com/en/', slug: 'land-rover', imageSrc: '/brands/LandRover.png', wordmark: 'LAND ROVER' },
  { name: 'Porsche', href: 'https://www.porsche.com/middle-east/_dubai_/', slug: 'porsche', path: porsche },
  { name: 'Ferrari', href: 'https://dubai.ferraridealers.com/en-GB', slug: 'ferrari', path: ferrari, scale: 1.2 },
  { name: 'Bentley', href: 'https://www.bentleymotors.com/en.html', slug: 'bentley', path: bentley, scale: 1.2 },
  { name: 'Rolls-Royce', href: 'https://www.rolls-roycemotorcars.com/en_GB/home.html', slug: 'rolls-royce', path: rollsRoyce },
  { name: 'Ford', href: 'https://www.me.ford.com/en/are/', slug: 'ford', path: ford },
  { name: 'Chevrolet', href: 'https://www.chevroletarabia.com/ae-en', slug: 'chevrolet', path: chevrolet },
  { name: 'Hyundai', href: 'https://hyundai-uae.com/en/', slug: 'hyundai', path: hyundai },
  { name: 'Dodge', href: 'https://www.dodgeuae.com/en/', slug: 'dodge', imageSrc: '/brands/Dodge.png', wordmark: 'DODGE', imageFilter: '[filter:invert(1)]' },
  { name: 'Honda', href: 'https://honda-mideast.com/_site_uae', slug: 'honda', path: honda },
  { name: 'Mitsubishi', href: 'https://habtoormotors.com/mitsubishi/', slug: 'mitsubishi', path: mitsubishi },
  { name: 'Tesla', href: 'https://www.tesla.com/en_ae', slug: 'tesla', path: tesla },
] as const
