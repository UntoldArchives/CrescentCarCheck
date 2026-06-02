'use client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  arrow?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', loading = false, arrow = false, fullWidth = false, children, className, disabled, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-button font-semibold',
          'transition-all duration-200 ease-smooth',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          {
            'bg-accent text-background hover:bg-accent-hover active:scale-[0.98]': variant === 'primary',
            'bg-card text-text-primary border border-border hover:border-border-hover hover:bg-card-hover': variant === 'secondary',
            'bg-transparent text-text-primary border border-white/25 hover:border-white/50 hover:bg-white/5': variant === 'outline',
            'bg-transparent text-text-secondary hover:text-text-primary': variant === 'ghost',
            'bg-error text-white hover:opacity-90': variant === 'danger',
            'px-4 py-2 text-sm': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
            'px-8 py-4 text-lg': size === 'xl',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {children}
        {arrow && !loading && <span aria-hidden="true">→</span>}
      </button>
    )
  }
)
