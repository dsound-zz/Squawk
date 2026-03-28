import type { FlightPhase } from '../types/aircraft'

export interface AtcStream {
  label: string
  url: string
}

// LiveATC.net Icecast stream URLs for KJFK
// .pls files redirect to the actual stream — pass directly to <audio src>
export const ATC_STREAMS: Record<Exclude<FlightPhase, 'unknown'>, AtcStream> = {
  ground: {
    label: 'JFK Ground',
    url: 'https://www.liveatc.net/play/kjfk_gnd.pls',
  },
  tower: {
    label: 'JFK Tower',
    url: 'https://www.liveatc.net/play/kjfk3.pls',
  },
  approach: {
    label: 'NY TRACON Approach',
    url: 'https://www.liveatc.net/play/kjfk_app.pls',
  },
  departure: {
    label: 'NY TRACON Departure',
    url: 'https://www.liveatc.net/play/kjfk_app.pls',
  },
}

export function streamForPhase(phase: FlightPhase): AtcStream | null {
  if (phase === 'unknown') return null
  return ATC_STREAMS[phase]
}
