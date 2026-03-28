import { useEffect, useRef, useState } from 'react'
import type { Aircraft, InterpolatedAircraft } from '../types/aircraft'
import { getPhase, getAirport, isHelicopter } from '../lib/flightPhase'

const TICK_MS = 10_000

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Shortest-path heading interpolation
function lerpHeading(a: number, b: number, t: number): number {
  let diff = b - a
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return (a + diff * t + 360) % 360
}

function buildMap(aircraft: Aircraft[]): Map<string, Aircraft> {
  return new Map(aircraft.map((a) => [a.icao24, a]))
}

export function useInterpolation(
  previous: Aircraft[],
  current: Aircraft[],
  tickAt: number,
): InterpolatedAircraft[] {
  const [interpolated, setInterpolated] = useState<InterpolatedAircraft[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const prevMap = buildMap(previous)

    const animate = () => {
      const elapsed = Date.now() - tickAt
      const t = Math.min(elapsed / TICK_MS, 1)

      const result: InterpolatedAircraft[] = current.map((ac) => {
        const prev = prevMap.get(ac.icao24)
        const fromLat = prev?.latitude ?? ac.latitude
        const fromLon = prev?.longitude ?? ac.longitude
        const fromHead = prev?.heading ?? ac.heading ?? 0

        return {
          ...ac,
          interpLat: lerp(fromLat, ac.latitude, t),
          interpLon: lerp(fromLon, ac.longitude, t),
          interpHeading: lerpHeading(fromHead, ac.heading ?? fromHead, t),
          phase: getPhase(ac),
          isHelicopter: isHelicopter(ac),
          airport: getAirport(ac, getPhase(ac)),
        }
      })

      setInterpolated(result)
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [previous, current, tickAt])

  return interpolated
}
