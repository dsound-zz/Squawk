import { useEffect, useRef, useState } from 'react'
import type { Aircraft } from '../types/aircraft'

const POLL_MS = 10_000

interface FeedState {
  previous: Aircraft[]
  current: Aircraft[]
  tickAt: number
}

export function useAircraftFeed() {
  const [feed, setFeed] = useState<FeedState>({ previous: [], current: [], tickAt: Date.now() })
  const [error, setError] = useState<string | null>(null)
  const prevRef = useRef<Aircraft[]>([])

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/aircraft')
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        const json = (await res.json()) as { aircraft: Aircraft[] }
        setFeed({
          previous: prevRef.current,
          current: json.aircraft,
          tickAt: Date.now(),
        })
        prevRef.current = json.aircraft
        setError(null)
      } catch (e) {
        setError(String(e))
      }
    }

    fetch_()
    const id = setInterval(fetch_, POLL_MS)
    return () => clearInterval(id)
  }, [])

  return { feed, error }
}
