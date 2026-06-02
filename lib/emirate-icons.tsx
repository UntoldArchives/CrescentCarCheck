import type { SVGProps } from 'react'

/**
 * Simplified line-art landmark glyphs for each emirate. Original geometry,
 * drawn to evoke (not depict) each emirate's most recognised silhouette:
 * Abu Dhabi — Louvre dome, Dubai — Burj Khalifa, Sharjah — mosque,
 * Ajman — arched portico, Umm Al Quwain — fort, Fujairah — watchtower,
 * Ras Al Khaimah — gateway. 24x24 viewBox, currentColor stroke.
 */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function AbuDhabiIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="10" r="6" />
      <path d="M6 10h12" />
      <path d="M12 4v12" />
      <path d="M7.76 5.76l8.48 8.48" />
      <path d="M16.24 5.76l-8.48 8.48" />
      <path d="M8 16v4M16 16v4" />
      <path d="M4.5 20h15" />
    </svg>
  )
}

export function DubaiIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2v3" />
      <path d="M10 5h4l-.5 4h-3z" />
      <path d="M9.5 9h5l-.5 4h-4z" />
      <path d="M9 13h6l-.5 4h-5z" />
      <path d="M8.5 17h7v3h-7z" />
      <path d="M7 20h10" />
    </svg>
  )
}

export function SharjahIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 20V11a1.5 1.5 0 0 1 3 0v9" />
      <path d="M16 20V11a1.5 1.5 0 0 1 3 0v9" />
      <path d="M6.5 9V8M17.5 9V8" />
      <path d="M8 20v-6" />
      <path d="M16 20v-6" />
      <path d="M8 14c0-3 1.8-5 4-5s4 2 4 5" />
      <path d="M12 6v3" />
      <path d="M11 20v-3a1 1 0 0 1 2 0v3" />
      <path d="M4 20h16" />
    </svg>
  )
}

export function AjmanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 20V10h18v10" />
      <path d="M3 10l9-5 9 5" />
      <path d="M9 20v-5a3 3 0 0 1 6 0v5" />
      <path d="M5.5 20v-6M18.5 20v-6" />
      <path d="M5.5 14h2M16.5 14h2" />
      <path d="M2 20h20" />
    </svg>
  )
}

export function UmmAlQuwainIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 20v-7h5V8h8v5h5v7" />
      <path d="M8 8V6h1.5v2M10.5 8V6H12v2M13 8V6h1.5v2M15.5 8V6" />
      <path d="M3 13v-1.5M5 13v-1.5M19 13v-1.5M21 13v-1.5" />
      <path d="M11 20v-3a1 1 0 0 1 2 0v3" />
      <path d="M2 20h20" />
    </svg>
  )
}

export function FujairahIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 20V8h10v12" />
      <path d="M7 8V5h2v3M11 8V5h2v3M15 8V5h2v3" />
      <path d="M11 20v-5a1 1 0 0 1 2 0v5" />
      <rect x="10.5" y="10" width="3" height="2.5" />
      <path d="M5 20h14" />
    </svg>
  )
}

export function RasAlKhaimahIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20L6 5h12l2 15z" />
      <path d="M5 9h14" />
      <path d="M10 20v-7a2 2 0 0 1 4 0v7" />
      <path d="M2 20h20" />
    </svg>
  )
}

export type EmirateSlug =
  | 'abu-dhabi'
  | 'dubai'
  | 'sharjah'
  | 'ajman'
  | 'umm-al-quwain'
  | 'fujairah'
  | 'ras-al-khaimah'

export const EMIRATE_ICON: Record<EmirateSlug, (p: IconProps) => React.JSX.Element> = {
  'abu-dhabi': AbuDhabiIcon,
  dubai: DubaiIcon,
  sharjah: SharjahIcon,
  ajman: AjmanIcon,
  'umm-al-quwain': UmmAlQuwainIcon,
  fujairah: FujairahIcon,
  'ras-al-khaimah': RasAlKhaimahIcon,
}
