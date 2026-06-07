import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'relative block h-12 w-[170px] sm:h-14 sm:w-[200px]',
        '[filter:drop-shadow(0_2px_10px_rgba(255,198,0,0.35))]',
        className
      )}
    >
      <Image
        src="/Logo Non BG.png"
        alt="Crescent Car Check"
        fill
        sizes="(min-width: 640px) 200px, 170px"
        priority
        className="object-contain object-left"
      />
    </span>
  )
}
