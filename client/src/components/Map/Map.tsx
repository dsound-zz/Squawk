import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import type { InterpolatedAircraft } from '../../types/aircraft'
import type { Filters } from '../FilterBar/FilterBar'
import { AircraftIcon } from '../AircraftIcon/AircraftIcon'
import 'leaflet/dist/leaflet.css'

// KJFK center
const KJFK: [number, number] = [40.6413, -73.7781]

interface Props {
  aircraft: InterpolatedAircraft[]
  filters: Filters
  selectedIcao: string | null
  onSelect: (icao: string) => void
}

export function Map({ aircraft, filters, selectedIcao, onSelect }: Props) {
  const visible = aircraft.filter((ac) => {
    if (filters.helicopterOnly && !ac.isHelicopter) return false
    if (!filters.phases.has(ac.phase)) return false
    // Airport filter applies only to ground/tower — approach/departure are airport-agnostic
    if (filters.airports.size > 0 && (ac.phase === 'ground' || ac.phase === 'tower')) {
      if (ac.airport === null || !filters.airports.has(ac.airport)) return false
    }
    return true
  })

  return (
    <MapContainer
      center={KJFK}
      zoom={10}
      style={{ height: '100%', width: '100%', background: '#0d1117' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {visible.map((ac) => {
        const selected = ac.icao24 === selectedIcao
        const html = renderToStaticMarkup(
          <AircraftIcon
            heading={ac.interpHeading}
            phase={ac.phase}
            isHelicopter={ac.isHelicopter}
            selected={selected}
          />,
        )
        const icon = divIcon({
          html,
          className: '',
          iconSize: [selected ? 28 : 22, selected ? 28 : 22],
          iconAnchor: [selected ? 14 : 11, selected ? 14 : 11],
        })

        return (
          <Marker
            key={ac.icao24}
            position={[ac.interpLat, ac.interpLon]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(ac.icao24) }}
          />
        )
      })}

      <RecenterControl />
    </MapContainer>
  )
}

// Keeps map centred on KJFK on first load; no-op after
function RecenterControl() {
  const map = useMap()
  map.setMinZoom(7)
  return null
}
