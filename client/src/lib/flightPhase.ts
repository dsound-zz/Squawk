import type { Aircraft, FlightPhase, Airport } from '../types/aircraft'

const FT = 0.3048                // metres per foot
const KNOT = 0.514444            // m/s per knot

const GROUND_ALT_M = 50 * FT    // 50 ft
const GROUND_VEL_MS = 30 * KNOT // 30 kts
const TOWER_ALT_M = 3000 * FT   // 3,000 ft
const MAX_ALT_M = 18000 * FT    // 18,000 ft

// Climbing faster than 400 fpm → departure
const DEPARTURE_VRATE = 400 * FT / 60  // m/s

// OpenSky category 7 = rotorcraft
const ROTORCRAFT_CATEGORY = 7

const AIRPORTS: { icao: Airport; lat: number; lon: number }[] = [
  { icao: 'KJFK', lat: 40.6413, lon: -73.7781 },
  { icao: 'KLGA', lat: 40.7769, lon: -73.8740 },
  { icao: 'KEWR', lat: 40.6895, lon: -74.1745 },
]

// Approximate degree-distance (equirectangular, fine for <50km)
function distDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dlat = lat2 - lat1
  const dlon = (lon2 - lon1) * Math.cos(lat1 * Math.PI / 180)
  return Math.sqrt(dlat * dlat + dlon * dlon)
}

// Radius thresholds in degrees (~111km/degree)
const GROUND_RADIUS = 0.030   // ~3.3km — airport surface
const TOWER_RADIUS  = 0.135   // ~15km — immediate airspace

export function getPhase(a: Aircraft): FlightPhase {
  const alt = a.altitude ?? 0
  const vel = a.velocity ?? 0

  if (a.onGround || (alt < GROUND_ALT_M && vel < GROUND_VEL_MS)) return 'ground'
  if (alt < TOWER_ALT_M) return 'tower'
  if (alt <= MAX_ALT_M) {
    return (a.verticalRate !== null && a.verticalRate > DEPARTURE_VRATE) ? 'departure' : 'approach'
  }
  return 'unknown'
}

export function getAirport(a: Aircraft, phase: FlightPhase): Airport | null {
  if (phase !== 'ground' && phase !== 'tower') return null
  const radius = phase === 'ground' ? GROUND_RADIUS : TOWER_RADIUS

  let nearest: Airport | null = null
  let nearestDist = Infinity

  for (const ap of AIRPORTS) {
    const d = distDeg(a.latitude, a.longitude, ap.lat, ap.lon)
    if (d < radius && d < nearestDist) {
      nearest = ap.icao
      nearestDist = d
    }
  }

  return nearest
}

export function isHelicopter(a: Aircraft): boolean {
  return a.category === ROTORCRAFT_CATEGORY
}
