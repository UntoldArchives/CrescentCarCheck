import { cn } from '@/lib/utils'

export const inputBase =
  'w-full rounded-input border bg-light-card text-light-text placeholder-light-text-muted ' +
  'px-3.5 py-2.5 text-sm transition-colors duration-150 ' +
  'focus:outline-none focus:border-accent focus:shadow-input-focus'

export const labelClass =
  'block text-xs font-semibold text-light-text-secondary uppercase tracking-wider mb-1.5'

export const selectChevronStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
}

export const selectClass = cn(
  inputBase,
  'appearance-none bg-[length:14px_14px] bg-no-repeat bg-[right_0.85rem_center] pr-9',
)

interface FieldProps {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

export function Field({ id, label, required, optional, error, hint, children }: FieldProps) {
  return (
    <div id={`field-${id}`}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && (
          <span className="text-error ml-1" aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className="text-light-text-muted ml-1 normal-case font-normal tracking-normal">
            (optional)
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-light-text-muted text-xs mt-1.5">{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-error text-xs mt-1.5">
          {error}
        </p>
      )}
    </div>
  )
}

export function fieldBorder(hasError?: string) {
  return hasError ? 'border-error' : 'border-light-border'
}
