import type { FlightPhase } from '../types/aircraft'

export interface AtcStream {
  label: string
  url: string
}

// LiveATC.net Icecast stream URLs for KJFK
// .pls files redirect to the actual stream — pass directly to <audio src>
// Fallback for missing/unknown airport on ground/tower
export const ATC_STREAMS: Record<Exclude<FlightPhase, 'unknown'>, AtcStream> = {
  ground: {
    label: 'JFK Ground (121.9)',
    url: 'https://www.liveatc.net/play/kjfk_gnd.pls',
  },
  tower: {
    label: 'JFK Tower (119.1)',
    url: 'https://www.liveatc.net/play/kjfk_twr.pls',
  },
  approach: {
    label: 'NY TRACON Approach (127.4)',
    url: 'https://www.liveatc.net/play/kjfk2.pls',
  },
  departure: {
    label: 'NY TRACON Departure (135.9)',
    url: 'https://www.liveatc.net/play/kjfk2.pls',
  },
}

export function streamForPhase(phase: FlightPhase, airport: string | null = null): AtcStream | null {
  if (phase === 'unknown') return null

  if (phase === 'approach') return ATC_STREAMS.approach
  if (phase === 'departure') return ATC_STREAMS.departure

  if (airport === 'KJFK') {
    if (phase === 'ground') return { label: 'JFK Ground (121.9)', url: 'https://www.liveatc.net/play/kjfk_gnd.pls' }
    if (phase === 'tower') return { label: 'JFK Tower (119.1)', url: 'https://www.liveatc.net/play/kjfk_twr.pls' }
  } else if (airport === 'KLGA') {
    if (phase === 'ground') return { label: 'LGA Ground (121.7)', url: 'https://www.liveatc.net/play/klga_gnd.pls' }
    if (phase === 'tower') return { label: 'LGA Tower (118.7)', url: 'https://www.liveatc.net/play/klga_twr.pls' }
  } else if (airport === 'KEWR') {
    if (phase === 'ground') return { label: 'EWR Ground (121.8)', url: 'https://www.liveatc.net/play/kewr_gnd.pls' }
    if (phase === 'tower') return { label: 'EWR Tower (118.3)', url: 'https://www.liveatc.net/play/kewr_twr.pls' }
  }

  return ATC_STREAMS[phase]
}
