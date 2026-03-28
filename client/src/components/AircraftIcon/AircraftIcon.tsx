import type { FlightPhase } from '../../types/aircraft'

const PHASE_COLOR: Record<FlightPhase, string> = {
  ground:    '#9ca3af',  // gray-400
  tower:     '#f59e0b',  // amber-400
  approach:  '#22d3ee',  // cyan-400
  departure: '#a78bfa',  // violet-400
  unknown:   '#6b7280',  // gray-500
}

const PHASE_COLOR_SELECTED: Record<FlightPhase, string> = {
  ground:    '#4b5563',  // gray-600
  tower:     '#b45309',  // amber-700
  approach:  '#0891b2',  // cyan-600
  departure: '#7c3aed',  // violet-600
  unknown:   '#374151',  // gray-700
}

interface Props {
  heading: number
  phase: FlightPhase
  isHelicopter: boolean
  selected: boolean
}

export function AircraftIcon({ heading, phase, isHelicopter, selected }: Props) {
  const color = selected ? PHASE_COLOR_SELECTED[phase] : PHASE_COLOR[phase]
  const size = selected ? 28 : 22

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${heading}deg)`, display: 'block' }}
      fill={color}
      stroke="none"
      strokeWidth={0}
    >
      {isHelicopter ? (
        // Simple rotor blade icon
        <>
          <ellipse cx="12" cy="6" rx="8" ry="2" />
          <ellipse cx="12" cy="6" rx="2" ry="8" />
          <rect x="10" y="8" width="4" height="10" rx="1" />
        </>
      ) : (
        // Airplane silhouette
        <path d="M12 2 L15 10 L22 12 L15 14 L13 22 L12 20 L11 22 L9 14 L2 12 L9 10 Z" />
      )}
    </svg>
  )
}
