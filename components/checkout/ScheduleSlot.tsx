'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock, Check, Loader2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Field, inputBase, fieldBorder, labelClass } from '@/components/ui/Field'
import { SLOTS } from '@/lib/packages'
import type { DistanceClass, SlotTime } from '@/types/booking'

interface ScheduleSlotProps {
  idPrefix: string
  inspectionDate: string
  slotTime: SlotTime | ''
  distance: DistanceClass
  errors: { inspectionDate?: string; slotTime?: string }
  onChange: (patch: { inspectionDate?: string; slotTime?: SlotTime | '' }) => void
  /** Bumped by the parent (e.g. after a 409 on submit) to force a re-check. */
  refreshKey?: number
}

/** Availability for one slot, keyed by its SlotTime value. */
type SlotState = { available: boolean; reason: string | null }
type Availability = Partial<Record<SlotTime, SlotState>>

/** API row shape from /api/availability. */
type ApiSlot = { slot: SlotTime; available: boolean; reason: string | null }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Earliest selectable date is today — we try to accommodate same-day slots. */
function todayISO(): string {
  const d = new Date()
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

/** Short human hint for why a slot can't be booked (best-effort — unknown reasons
 *  just fall back to the generic "Unavailable" tag with no hint). */
function reasonHint(reason: string | null): string | null {
  switch (reason) {
    // long_distance_first_slot_only intentionally has no per-slot hint — the
    // single note above the grid (shown for long-distance emirates) explains it.
    case 'travel_buffer':
    case 'travel_buffer_unavailable':
      return 'Blocked by a long-distance trip'
    case 'cutoff':
      return 'Too soon to book'
    case 'booked':
      return 'Already booked'
    case 'blocked':
      return 'Not available'
    default:
      return null
  }
}

export function ScheduleSlot({
  idPrefix,
  inspectionDate,
  slotTime,
  distance,
  errors,
  onChange,
  refreshKey = 0,
}: ScheduleSlotProps) {
  const id = (k: string) => `${idPrefix}-${k}`

  const [availability, setAvailability] = useState<Availability | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [clearedMessage, setClearedMessage] = useState(false)

  // Keep the latest onChange + selected slot in refs so the fetch effect can use
  // them without re-running on every parent render or slot selection. Refs are
  // synced in an effect (never during render).
  const onChangeRef = useRef(onChange)
  const selectedRef = useRef(slotTime)
  useEffect(() => {
    onChangeRef.current = onChange
    selectedRef.current = slotTime
  })

  useEffect(() => {
    let active = true
    const valid = DATE_RE.test(inspectionDate) && inspectionDate >= todayISO()

    if (!valid) {
      // Defer to a task so we never call setState synchronously in the effect body.
      const reset = setTimeout(() => {
        if (!active) return
        setAvailability(null)
        setLoadError(false)
        setLoading(false)
      }, 0)
      return () => {
        active = false
        clearTimeout(reset)
      }
    }

    const start = setTimeout(() => {
      if (!active) return
      setLoading(true)
      setLoadError(false)
      setClearedMessage(false)
    }, 0)

    fetch(
      `/api/availability?date=${encodeURIComponent(inspectionDate)}&distance=${distance}`,
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
      .then((data: { ok?: boolean; slots?: ApiSlot[] }) => {
        if (!active) return
        if (!data.ok || !data.slots) {
          setLoadError(true)
          setAvailability(null)
          return
        }
        const map: Availability = {}
        for (const s of data.slots) {
          map[s.slot] = { available: s.available, reason: s.reason }
        }
        setAvailability(map)
        // If the currently selected slot is now unavailable (e.g. distance changed
        // to long and slot ≠ 09:30), clear it.
        const selected = selectedRef.current
        if (selected && map[selected] && !map[selected]!.available) {
          onChangeRef.current({ slotTime: '' })
          setClearedMessage(true)
        }
      })
      .catch(() => {
        if (active) {
          setLoadError(true)
          setAvailability(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      clearTimeout(start)
    }
  }, [inspectionDate, distance, refreshKey])

  const dateChosen = DATE_RE.test(inspectionDate) && inspectionDate >= todayISO()

  return (
    <div>
      <Field id={id('inspectionDate')} label="Date" required error={errors.inspectionDate}>
        <input
          id={id('inspectionDate')}
          type="date"
          value={inspectionDate}
          min={todayISO()}
          max={maxISO()}
          onChange={(e) => onChange({ inspectionDate: e.target.value })}
          className={cn(inputBase, fieldBorder(errors.inspectionDate))}
        />
      </Field>

      <div id={`field-${id('slotTime')}`} className="mt-5">
        <span className={labelClass}>
          Time slot
          <span className="text-error ml-1" aria-hidden="true">
            *
          </span>
        </span>

        {distance === 'long' && (
          <p className="text-light-text-muted text-xs mt-1 mb-2 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>
              For long-distance areas (Abu Dhabi, Al Ain, Ras Al Khaimah, Fujairah)
              inspections run at <strong>9:30 AM only</strong>, so the inspector can make the
              round trip in time. Other slots are unavailable for these locations.
            </span>
          </p>
        )}

        {dateChosen && loading && (
          <p className="text-light-text-muted text-xs mt-1 mb-2 flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            Checking availability…
          </p>
        )}

        <div
          role="radiogroup"
          aria-label="Time slot"
          aria-busy={loading}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {SLOTS.map((s) => {
            const active = slotTime === s.value
            const state = availability?.[s.value]
            // Unavailable only once we have a definite answer for a chosen date.
            const unavailable = dateChosen && !loading && state ? !state.available : false
            const disabled = unavailable || (dateChosen && loading)
            const hint = unavailable ? reasonHint(state?.reason ?? null) : null

            return (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                onClick={() => {
                  setClearedMessage(false)
                  onChange({ slotTime: s.value })
                }}
                className={cn(
                  'relative rounded-card border p-4 text-left transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  unavailable
                    ? 'border-light-border bg-light-bg opacity-60 cursor-not-allowed'
                    : disabled
                      ? 'border-light-border bg-light-card opacity-70 cursor-wait'
                      : active
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-light-border bg-light-card hover:border-accent/50',
                )}
              >
                {active && !unavailable && (
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent text-background grid place-items-center"
                  >
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <Clock
                  className={cn('w-5 h-5', active && !unavailable ? 'text-accent' : 'text-light-text-muted')}
                  aria-hidden="true"
                />
                <span className="block font-bold text-light-text mt-2">{s.label}</span>
                {unavailable ? (
                  <>
                    <span className="mt-2 inline-block text-xs font-semibold text-error uppercase tracking-wide">
                      Unavailable
                    </span>
                    {hint && (
                      <span className="block text-light-text-muted text-xs mt-1">{hint}</span>
                    )}
                  </>
                ) : null}
              </button>
            )
          })}
        </div>

        {clearedMessage && (
          <p role="alert" className="text-error text-xs mt-2">
            That slot isn&apos;t available. Please choose another time.
          </p>
        )}

        {loadError && dateChosen && (
          <p className="text-light-text-muted text-xs mt-2">
            We couldn&apos;t check availability — you can still pick a slot and we&apos;ll
            confirm by WhatsApp.
          </p>
        )}

        <p className="text-light-text-muted text-xs mt-3 leading-relaxed">
          Choose a date and time slot. Our team will contact you on WhatsApp to confirm the
          exact arrival timing.
        </p>

        {errors.slotTime && !clearedMessage && (
          <p role="alert" className="text-error text-xs mt-2">
            {errors.slotTime}
          </p>
        )}
      </div>
    </div>
  )
}
