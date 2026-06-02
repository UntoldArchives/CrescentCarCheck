import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonLinkProps {
  href: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  arrow?: boolean
  fullWidth?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  fullWidth = false,
  className,
  children,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-button font-semibold',
        'transition-all duration-200 ease-smooth',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        {
          'bg-accent text-background hover:bg-accent-hover active:scale-[0.98]': variant === 'primary',
          'bg-card text-text-primary border border-border hover:border-border-hover hover:bg-card-hover': variant === 'secondary',
          'bg-transparent text-text-primary border border-white/25 hover:border-white/50 hover:bg-white/5': variant === 'outline',
          'bg-transparent text-text-secondary hover:text-text-primary': variant === 'ghost',
          'px-4 py-2 text-sm': size === 'sm',
          'px-5 py-2.5 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'px-8 py-4 text-lg': size === 'xl',
          'w-full': fullWidth,
        },
        className
      )}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </Link>
  )
}
