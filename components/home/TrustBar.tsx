import { ShieldCheck, MapPin, Clock, FileText, Car, Wrench } from 'lucide-react'

const ITEMS = [
  { Icon: Car, label: 'On-Site Inspection' },
  { Icon: MapPin, label: 'All Seven Emirates' },
  { Icon: Wrench, label: 'Up to 600 Check Points' },
  { Icon: FileText, label: 'Instant Digital Report' },
  { Icon: Clock, label: 'Same-Day Slots' },
  { Icon: ShieldCheck, label: 'Independent & Unbiased' },
]

// Repeat the items enough times that a single copy always overflows the
// widest viewport, so the -50% loop never exposes an empty gap.
const REPEATED = Array.from({ length: 4 }, () => ITEMS).flat()

function MarqueeCopy({ ariaHidden }: { ariaHidden: boolean }) {
  return (
    <ul className="flex items-center shrink-0" aria-hidden={ariaHidden}>
      {REPEATED.map(({ Icon, label }, i) => (
        <li key={i} className="flex items-center">
          <span className="flex items-center gap-2 px-7 whitespace-nowrap">
            <Icon className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-text-secondary font-medium">{label}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

export function TrustBar() {
  return (
    <div className="bg-surface border-y border-border py-4 overflow-hidden marquee-mask">
      <div className="marquee-track">
        <MarqueeCopy ariaHidden={false} />
        <MarqueeCopy ariaHidden />
      </div>
    </div>
  )
}
