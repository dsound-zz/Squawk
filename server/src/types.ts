export interface Aircraft {
  icao24: string
  callsign: string | null
  latitude: number
  longitude: number
  altitude: number | null   // meters (barometric)
  velocity: number | null   // m/s
  heading: number | null    // true track degrees
  onGround: boolean
  verticalRate: number | null
  category: number | null   // ICAO category (1=No info, 7=Rotorcraft…)
  lastContact: number       // unix timestamp
}

// OpenSky state vector tuple indices
// [icao24, callsign, origin_country, time_position, last_contact,
//  longitude, latitude, baro_altitude, on_ground, velocity,
//  true_track, vertical_rate, sensors, geo_altitude, squawk,
//  spi, position_source, category]
export type StateVector = [
  string,         // 0  icao24
  string | null,  // 1  callsign
  string,         // 2  origin_country
  number | null,  // 3  time_position
  number,         // 4  last_contact
  number | null,  // 5  longitude
  number | null,  // 6  latitude
  number | null,  // 7  baro_altitude
  boolean,        // 8  on_ground
  number | null,  // 9  velocity
  number | null,  // 10 true_track
  number | null,  // 11 vertical_rate
  null,           // 12 sensors
  number | null,  // 13 geo_altitude
  string | null,  // 14 squawk
  boolean,        // 15 spi
  number,         // 16 position_source
  number | null,  // 17 category
]
