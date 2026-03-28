import type { Aircraft } from './types.js'

interface CacheStore {
  aircraft: Aircraft[]
  fetchedAt: number
  stale: boolean
}

let store: CacheStore = {
  aircraft: [],
  fetchedAt: 0,
  stale: false,
}

export function setCache(aircraft: Aircraft[]): void {
  store = { aircraft, fetchedAt: Date.now(), stale: false }
}

export function markStale(): void {
  store.stale = true
}

export function getCache(): CacheStore {
  return store
}
