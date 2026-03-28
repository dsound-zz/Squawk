import type { Aircraft, StateVector } from './types.js'
import { setCache, markStale } from './cache.js'

// KJFK ~40-mile bounding box
const BBOX = {
  lamin: 40.06,
  lamax: 41.22,
  lomin: -74.55,
  lomax: -72.99,
}

const MAX_ALT_M = 18000 * 0.3048 // 18,000 ft → metres (~5486m)

function buildUrl(): string {
  const base = 'https://opensky-network.org/api/states/all'
  const params = new URLSearchParams({
    lamin: String(BBOX.lamin),
    lamax: String(BBOX.lamax),
    lomin: String(BBOX.lomin),
    lomax: String(BBOX.lomax),
  })
  return `${base}?${params}`
}

function buildHeaders(): HeadersInit {
  const user = process.env.OPENSKY_USER
  const pass = process.env.OPENSKY_PASS
  if (user && pass) {
    return {
      Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
    }
  }
  return {}
}

function normalise(sv: StateVector): Aircraft | null {
  const [icao24, callsign, , , lastContact, lon, lat, alt, onGround, vel, track, vrate, , , , , , cat] = sv

  // Drop aircraft with no position
  if (lat === null || lon === null) return null

  // Filter above ceiling
  if (alt !== null && alt > MAX_ALT_M) return null

  return {
    icao24,
    callsign: callsign?.trim() || null,
    latitude: lat,
    longitude: lon,
    altitude: alt,
    velocity: vel,
    heading: track,
    onGround,
    verticalRate: vrate,
    category: cat ?? null,
    lastContact,
  }
}

export function startPoller(intervalMs: number): void {
  const poll = async () => {
    try {
      const res = await fetch(buildUrl(), { headers: buildHeaders() })
      if (!res.ok) throw new Error(`OpenSky responded ${res.status}`)

      const json = (await res.json()) as { states: StateVector[] | null }
      const states = json.states ?? []
      const aircraft = states.map(normalise).filter((a): a is Aircraft => a !== null)

      setCache(aircraft)
      console.log(`[poller] ${new Date().toISOString()} — ${aircraft.length} aircraft cached`)
    } catch (err) {
      markStale()
      console.error('[poller] fetch failed, serving stale cache:', err)
    }
  }

  // Fire immediately, then on interval
  poll()
  setInterval(poll, intervalMs)
}
