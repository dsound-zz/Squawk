import type { InterpolatedAircraft } from '../../types/aircraft'
import { AudioPlayer } from '../AudioPlayer/AudioPlayer'
import styles from './FlightWidget.module.css'

const MS_TO_KTS = 1.94384
const M_TO_FT = 3.28084
const MS_TO_FPM = 196.85  // m/s → ft/min

// OpenSky ADS-B emitter category labels
const CATEGORY_LABELS: Record<number, string> = {
  1:  'No info',
  2:  'Light',
  3:  'Small',
  4:  'Large',
  5:  'High-vortex',
  6:  'Heavy',
  7:  'High-perf',
  8:  'Rotorcraft',
  9:  'Glider',
  10: 'Lighter-than-air',
  11: 'Parachutist',
  12: 'Ultralight',
  14: 'UAV',
  15: 'Space vehicle',
  16: 'Emergency vehicle',
  17: 'Service vehicle',
}

function formatLastContact(ts: number): string {
  const secs = Math.round((Date.now() / 1000) - ts)
  if (secs < 60) return `${secs}s ago`
  return `${Math.round(secs / 60)}m ago`
}

interface Props {
  aircraft: InterpolatedAircraft
  onClose: () => void
}

export function FlightWidget({ aircraft, onClose }: Props) {
  const altFt    = aircraft.altitude     != null ? Math.round(aircraft.altitude * M_TO_FT)    : null
  const velKts   = aircraft.velocity     != null ? Math.round(aircraft.velocity * MS_TO_KTS)  : null
  const hdg      = aircraft.heading      != null ? Math.round(aircraft.heading)                : null
  const vrateFpm = aircraft.verticalRate != null ? Math.round(aircraft.verticalRate * MS_TO_FPM) : null
  const catLabel = aircraft.category != null ? (CATEGORY_LABELS[aircraft.category] ?? null) : null

  const vrateStr = vrateFpm != null
    ? `${vrateFpm > 0 ? '+' : ''}${vrateFpm.toLocaleString()} fpm`
    : null

  const PHASE_COLOR: Record<string, string> = {
    ground:    '#9ca3af',
    tower:     '#f59e0b',
    approach:  '#22d3ee',
    departure: '#a78bfa',
    unknown:   '#6b7280',
  }
  const color = PHASE_COLOR[aircraft.phase] || '#ffffff'

  return (
    <div className={styles.widget} style={{ color }}>
      <button className={styles.close} onClick={onClose} aria-label="Close" style={{ color }}>×</button>

      <div className={styles.callsign}>
        {aircraft.callsign ?? aircraft.icao24.toUpperCase()}
      </div>

      <div className={styles.icao}>{aircraft.icao24.toUpperCase()}</div>

      <div className={styles.grid}>
        <Stat label="Phase"    value={aircraft.phase.toUpperCase()} />
        <Stat label="Altitude" value={altFt    != null ? `${altFt.toLocaleString()} ft`  : '—'} />
        <Stat label="Speed"    value={velKts   != null ? `${velKts} kts`                  : '—'} />
        <Stat label="Heading"  value={hdg      != null ? `${hdg}°`                        : '—'} />
        <Stat label="V/S"      value={vrateStr ?? '—'} />
        {aircraft.airport  && <Stat label="Airport"  value={aircraft.airport} />}
        {catLabel          && <Stat label="Category" value={catLabel} />}
        <Stat label="Contact"  value={formatLastContact(aircraft.lastContact)} />
      </div>

      <AudioPlayer phase={aircraft.phase} airport={aircraft.airport} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}
