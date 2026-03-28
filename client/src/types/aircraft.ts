export type FlightPhase = 'ground' | 'tower' | 'approach' | 'departure' | 'unknown'

export type Airport = 'KJFK' | 'KLGA' | 'KEWR'

export interface Aircraft {
  icao24: string
  callsign: string | null
  latitude: number
  longitude: number
  altitude: number | null   // metres
  velocity: number | null   // m/s
  heading: number | null    // degrees true
  onGround: boolean
  verticalRate: number | null
  category: number | null
  lastContact: number
}

export interface InterpolatedAircraft extends Aircraft {
  interpLat: number
  interpLon: number
  interpHeading: number
  phase: FlightPhase
  isHelicopter: boolean
  airport: Airport | null   // only set for ground/tower phases
}
