'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsCounterProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  duration?: number
}

export function StatsCounter({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 1800,
}: StatsCounterProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        observer.unobserve(el)

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(eased * value))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <div ref={ref} className="text-center px-2">
      <p className="text-display-sm sm:text-display-md md:text-display-lg font-black text-text-primary tabular-nums break-words">
        {prefix}
        {display.toLocaleString('en-US')}
        {suffix}
      </p>
      <p className="text-text-secondary text-xs sm:text-sm md:text-base mt-1">{label}</p>
    </div>
  )
}
