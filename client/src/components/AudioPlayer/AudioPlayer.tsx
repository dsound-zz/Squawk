import { useEffect, useRef, useState } from 'react'
import type { FlightPhase } from '../../types/aircraft'
import { streamForPhase } from '../../lib/atcStreams'
import styles from './AudioPlayer.module.css'

interface Props {
  phase: FlightPhase
  airport: string | null
}

export function AudioPlayer({ phase, airport }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const stream = streamForPhase(phase, airport)
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!stream) { setResolvedUrl(null); return }
    fetch(`/api/stream?url=${encodeURIComponent(stream.url)}`)
      .then(r => r.json())
      .then(({ streamUrl }) => setResolvedUrl(streamUrl))
      .catch(() => setResolvedUrl(null))
  }, [stream?.url])

  if (!stream) return null

  return (
    <div className={styles.player}>
      <span className={styles.label}>{stream.label}</span>
      <audio
        ref={audioRef}
        controls
        src={resolvedUrl ?? undefined}
        autoPlay
        className={styles.audio}
      />
    </div>
  )
}
