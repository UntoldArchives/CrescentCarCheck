'use client'
import { useEffect, useRef } from 'react'

/**
 * Reveals an element when it scrolls into view.
 *
 * Visibility contract: the hidden state ONLY exists when `<html>` carries
 * `js-reveal-ready` (added below as soon as a useReveal hook mounts). If the
 * client JS never runs (older browser, network error, hydration crash), the
 * class is never added and every `.reveal` section stays visible. This means
 * the page can never look "blank" because of a broken observer.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => el.classList.add('revealed')

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)

    // Safety net: never leave content invisible if the observer misbehaves.
    const fallback = window.setTimeout(reveal, 1200)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [threshold])

  return ref
}
