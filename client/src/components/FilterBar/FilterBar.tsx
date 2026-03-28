import type { FlightPhase, Airport } from '../../types/aircraft'
import styles from './FilterBar.module.css'

export interface Filters {
  phases: Set<FlightPhase>
  airports: Set<Airport>
  helicopterOnly: boolean
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  aircraftCount: number
}

const PHASE_LABELS: { phase: FlightPhase; label: string; color: string }[] = [
  { phase: 'ground',    label: 'Ground',    color: '#9ca3af' },
  { phase: 'tower',     label: 'Tower',     color: '#f59e0b' },
  { phase: 'approach',  label: 'Approach',  color: '#22d3ee' },
  { phase: 'departure', label: 'Departure', color: '#a78bfa' },
]

const AIRPORT_LABELS: { airport: Airport; color: string }[] = [
  { airport: 'KJFK', color: '#3b82f6' },
  { airport: 'KLGA', color: '#10b981' },
  { airport: 'KEWR', color: '#f97316' },
]

export function FilterBar({ filters, onChange, aircraftCount }: Props) {
  const togglePhase = (phase: FlightPhase) => {
    const next = new Set(filters.phases)
    next.has(phase) ? next.delete(phase) : next.add(phase)
    onChange({ ...filters, phases: next })
  }

  const toggleAirport = (airport: Airport) => {
    const next = new Set(filters.airports)
    next.has(airport) ? next.delete(airport) : next.add(airport)
    onChange({ ...filters, airports: next })
  }

  return (
    <div className={styles.bar}>
      <div className={styles.brand}>SQUAWK</div>

      <div className={styles.divider} />

      {PHASE_LABELS.map(({ phase, label, color }) => (
        <button
          key={phase}
          className={`${styles.pill} ${filters.phases.has(phase) ? styles.active : ''}`}
          style={{ '--phase-color': color } as React.CSSProperties}
          onClick={() => togglePhase(phase)}
        >
          <span className={styles.dot} />
          {label}
        </button>
      ))}

      <div className={styles.divider} />

      {AIRPORT_LABELS.map(({ airport, color }) => (
        <button
          key={airport}
          className={`${styles.pill} ${filters.airports.has(airport) ? styles.active : ''}`}
          style={{ '--phase-color': color } as React.CSSProperties}
          onClick={() => toggleAirport(airport)}
        >
          <span className={styles.dot} />
          {airport}
        </button>
      ))}

      <div className={styles.divider} />

      <button
        className={`${styles.pill} ${styles.heliPill} ${filters.helicopterOnly ? styles.active : ''}`}
        style={{ '--phase-color': '#e879f9' } as React.CSSProperties}
        onClick={() => onChange({ ...filters, helicopterOnly: !filters.helicopterOnly })}
      >
        <span className={styles.dot} />
        Heli only
      </button>

      <div className={styles.count}>{aircraftCount} ac</div>
    </div>
  )
}
