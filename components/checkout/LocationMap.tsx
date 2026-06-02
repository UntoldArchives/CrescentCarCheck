'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'

type Coords = { lat: number; lng: number }

interface LocationMapProps {
  /** Initial pin location. Defaults to central Dubai. */
  initialCoords?: Coords
  /** Fires when the user moves the pin or selects a search result. */
  onChange?: (coords: Coords, address: string) => void
  /** Map height. Defaults to 320px / 400px on sm+. */
  className?: string
}

const UAE_CENTER: Coords = { lat: 25.2048, lng: 55.2708 } // Downtown Dubai
const UAE_BOUNDS: [[number, number], [number, number]] = [
  [22.5, 51.4], // SW
  [26.4, 56.4], // NE
]

type NominatimResult = {
  lat: string
  lon: string
  display_name: string
  place_id: number
}

async function geocode(query: string): Promise<NominatimResult[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'json')
  url.searchParams.set('q', query)
  url.searchParams.set('countrycodes', 'ae')
  url.searchParams.set('limit', '6')
  url.searchParams.set('addressdetails', '0')
  try {
    const res = await fetch(url.toString(), {
      headers: { 'Accept-Language': 'en' },
    })
    if (!res.ok) return []
    return (await res.json()) as NominatimResult[]
  } catch {
    return []
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'json')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('zoom', '17')
  try {
    const res = await fetch(url.toString(), {
      headers: { 'Accept-Language': 'en' },
    })
    if (!res.ok) return ''
    const data = (await res.json()) as { display_name?: string }
    return data.display_name ?? ''
  } catch {
    return ''
  }
}

export function LocationMap({ initialCoords, onChange, className }: LocationMapProps) {
  const mapElRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)

  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Mount the map once on first client render.
  useEffect(() => {
    let cancelled = false
    let map: LeafletMap | null = null

    ;(async () => {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !mapElRef.current) return

      const start = initialCoords ?? UAE_CENTER
      map = L.map(mapElRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        maxBounds: UAE_BOUNDS,
        maxBoundsViscosity: 0.7,
      }).setView([start.lat, start.lng], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 8,
      }).addTo(map)

      const pinHtml = `
        <div style="
          width: 32px; height: 32px;
          background: #FFC600;
          border: 3px solid #000;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: grid; place-items: center;
        ">
          <div style="
            width: 10px; height: 10px;
            background: #000; border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `
      const accentIcon = L.divIcon({
        html: pinHtml,
        className: 'crescent-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      const marker = L.marker([start.lat, start.lng], {
        draggable: true,
        icon: accentIcon,
      }).addTo(map)

      marker.on('dragend', async () => {
        const pos = marker.getLatLng()
        const addr = await reverseGeocode(pos.lat, pos.lng)
        onChange?.({ lat: pos.lat, lng: pos.lng }, addr)
      })

      map.on('click', async (e) => {
        marker.setLatLng(e.latlng)
        const addr = await reverseGeocode(e.latlng.lat, e.latlng.lng)
        onChange?.({ lat: e.latlng.lat, lng: e.latlng.lng }, addr)
      })

      mapRef.current = map
      markerRef.current = marker
      setReady(true)
    })()

    return () => {
      cancelled = true
      if (map) {
        map.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
    // Intentionally only mount once; onChange/initialCoords updates handled elsewhere.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced search. All state updates run inside a timer (never synchronously
  // in the effect body) so a short/empty query clears results without triggering
  // a cascading render warning.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 3) {
      const clear = setTimeout(() => {
        setResults([])
        setShowResults(false)
      }, 0)
      return () => clearTimeout(clear)
    }
    const handle = setTimeout(async () => {
      setSearching(true)
      const found = await geocode(q)
      setResults(found)
      setSearching(false)
      setShowResults(true)
    }, 350)
    return () => clearTimeout(handle)
  }, [query])

  const selectResult = (r: NominatimResult) => {
    const lat = parseFloat(r.lat)
    const lng = parseFloat(r.lon)
    if (!mapRef.current || !markerRef.current) return
    mapRef.current.setView([lat, lng], 16)
    markerRef.current.setLatLng([lat, lng])
    setQuery(r.display_name)
    setShowResults(false)
    onChange?.({ lat, lng }, r.display_name)
  }

  return (
    <div className={className}>
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-muted pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder="Search for a location (e.g. JLT Cluster D, Dubai)"
          className="
            w-full rounded-input border border-light-border bg-light-card
            text-light-text placeholder-light-text-muted
            pl-10 pr-10 py-2.5 text-sm
            focus:outline-none focus:border-accent focus:shadow-input-focus
          "
          aria-label="Search location in the UAE"
          autoComplete="off"
        />
        {searching && (
          <Loader2
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-muted animate-spin"
            aria-hidden="true"
          />
        )}

        {showResults && results.length > 0 && (
          <ul
            className="
              absolute z-[1000] left-0 right-0 mt-1
              bg-light-card border border-light-border rounded-card
              shadow-[0_12px_36px_rgba(0,0,0,0.18)]
              max-h-72 overflow-y-auto
            "
            role="listbox"
          >
            {results.map((r) => (
              <li key={r.place_id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectResult(r)}
                  className="
                    w-full text-left px-4 py-2.5 text-sm text-light-text
                    hover:bg-light-bg flex items-start gap-2
                  "
                >
                  <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="leading-snug">{r.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative mt-3">
        <div
          ref={mapElRef}
          className="w-full h-72 sm:h-80 rounded-card border border-light-border bg-light-bg overflow-hidden"
          aria-label="Drag the pin to set the exact car location"
        />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-light-text-muted text-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Loading map…
            </div>
          </div>
        )}
      </div>

      <p className="text-light-text-muted text-xs mt-2 flex items-start gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
        Tap or drag the pin to set the exact spot. We use this to find the car on
        inspection day.
      </p>
    </div>
  )
}
