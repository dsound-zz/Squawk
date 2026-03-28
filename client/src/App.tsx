import { useState } from 'react'
import type { InterpolatedAircraft } from './types/aircraft'
import { useAircraftFeed } from './hooks/useAircraftFeed'
import { useInterpolation } from './hooks/useInterpolation'
import { Map } from './components/Map/Map'
import { FilterBar, type Filters } from './components/FilterBar/FilterBar'
import { FlightWidget } from './components/FlightWidget/FlightWidget'
import styles from './App.module.css'

const DEFAULT_FILTERS: Filters = {
  phases: new Set(['ground', 'tower', 'approach', 'departure'] as const),
  airports: new Set(),
  helicopterOnly: false,
}

export default function App() {
  const { feed, error } = useAircraftFeed()
  const interpolated = useInterpolation(feed.previous, feed.current, feed.tickAt)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedIcao, setSelectedIcao] = useState<string | null>(null)

  const selected: InterpolatedAircraft | undefined = interpolated.find(
    (ac) => ac.icao24 === selectedIcao,
  )

  return (
    <div className={styles.root}>
      <Map
        aircraft={interpolated}
        filters={filters}
        selectedIcao={selectedIcao}
        onSelect={setSelectedIcao}
      />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        aircraftCount={interpolated.length}
      />

      {selected && (
        <FlightWidget aircraft={selected} onClose={() => setSelectedIcao(null)} />
      )}

      {error && (
        <div className={styles.errorBanner}>
          Data feed error — {error}
        </div>
      )}
    </div>
  )
}
