'use client'

import { Sunrise, Sun, Sunset, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Field, inputBase, fieldBorder, labelClass } from '@/components/ui/Field'
import { TIME_WINDOWS } from '@/lib/packages'
import type { PreferredWindow } from '@/types/booking'

interface ScheduleSlotProps {
  idPrefix: string
  preferredDate: string
  preferredWindow: PreferredWindow | ''
  errors: { preferredDate?: string; preferredWindow?: string }
  onChange: (patch: { preferredDate?: string; preferredWindow?: PreferredWindow }) => void
}

const WINDOW_ICONS: Record<PreferredWindow, typeof Sun> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
}

/** Earliest selectable date is tomorrow (UAE business prep). */
function tomorrowISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

/** Latest selectable is 60 days from today. */
function maxISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

export function ScheduleSlot({
  idPrefix,
  preferredDate,
  preferredWindow,
  errors,
  onChange,
}: ScheduleSlotProps) {
  const id = (k: string) => `${idPrefix}-${k}`

  return (
    <div>
      <Field id={id('preferredDate')} label="Preferred date" required error={errors.preferredDate}>
        <input
          id={id('preferredDate')}
          type="date"
          value={preferredDate}
          min={tomorrowISO()}
          max={maxISO()}
          onChange={(e) => onChange({ preferredDate: e.target.value })}
          className={cn(inputBase, fieldBorder(errors.preferredDate))}
        />
      </Field>

      <div id={`field-${id('preferredWindow')}`} className="mt-5">
        <span className={labelClass}>
          Preferred time window
          <span className="text-error ml-1" aria-hidden="true">
            *
          </span>
        </span>

        <div
          role="radiogroup"
          aria-label="Preferred time window"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {TIME_WINDOWS.map((w) => {
            const active = preferredWindow === w.id
            const Icon = WINDOW_ICONS[w.id]
            return (
              <button
                key={w.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange({ preferredWindow: w.id })}
                className={cn(
                  'relative rounded-card border p-4 text-left transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  active
                    ? 'border-accent bg-accent/5 ring-1 ring-accent'
                    : 'border-light-border bg-light-card hover:border-accent/50'
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent text-background grid place-items-center"
                  >
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <Icon
                  className={cn('w-6 h-6', active ? 'text-accent' : 'text-light-text-muted')}
                  aria-hidden="true"
                />
                <span className="block font-bold text-light-text mt-2">{w.label}</span>
                <span className="block text-light-text-secondary text-sm mt-0.5">{w.range}</span>
              </button>
            )
          })}
        </div>

        <p className="text-light-text-muted text-xs mt-3 leading-relaxed">
          Choose your preferred inspection window. We&apos;ll confirm the exact arrival
          time by WhatsApp after reviewing the car location and inspector availability.
        </p>

        {errors.preferredWindow && (
          <p role="alert" className="text-error text-xs mt-2">
            {errors.preferredWindow}
          </p>
        )}
      </div>
    </div>
  )
}
