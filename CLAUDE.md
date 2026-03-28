# Squawk

A real-time ATC/aircraft tracking app for the NYC metro area (JFK, LGA, EWR). Displays live aircraft on a dark map, classifies them by flight phase, assigns ground/tower traffic to specific airports, and streams the relevant LiveATC.net ATC audio feed.

## Architecture

```
client/   React + Vite + TypeScript (port 5173)
server/   Express + TypeScript (port 3001)
```

The server polls OpenSky Network every 12s (configurable), caches results in memory, and serves them via `/api/aircraft`. The client polls the server every 10s and interpolates positions between ticks using `requestAnimationFrame`.

## Running locally

Two terminals:

```bash
cd server && npm run dev   # tsx watch, hot reload
cd client && npm run dev   # vite dev server
```

Or with Docker (single command, but slower iteration):

```bash
docker compose up
```

The Vite proxy (`client/vite.config.ts`) defaults to `http://localhost:3001`. Docker sets `API_URL=http://server:3001` via `docker-compose.yml`.

## Environment variables

`server/.env` (or `.env` at root for Docker):

```
OPENSKY_USER=your_username
OPENSKY_PASS=your_password
POLL_INTERVAL_MS=22000   # safe default for 4000/day registered limit
```

OpenSky limits: ~400 req/day anonymous, ~4000/day registered. At 12s polling = 7200/day (too many). Use ≥22s for registered accounts.

## Key data flow

```
OpenSky API → server/poller.ts → in-memory cache → GET /api/aircraft
                                                           ↓
                                              client/hooks/useAircraftFeed.ts
                                                           ↓
                                              client/hooks/useInterpolation.ts
                                              (lerp positions + assign phase/airport)
                                                           ↓
                                                    Map + FlightWidget
```

## Flight phase classification (`client/src/lib/flightPhase.ts`)

| Phase | Criteria |
|-------|----------|
| `ground` | `onGround=true` OR alt < 50ft AND speed < 30kts |
| `tower` | alt < 3,000ft |
| `departure` | 3,000–18,000ft AND vertical rate > 400 fpm |
| `approach` | 3,000–18,000ft AND vertical rate ≤ 400 fpm |
| `unknown` | alt > 18,000ft |

## Airport assignment (`client/src/lib/flightPhase.ts`)

Only assigned for `ground` and `tower` phases. Uses equirectangular proximity:
- Ground radius: ~3.3km (airport surface)
- Tower radius: ~15km (immediate airspace)

Airports: KJFK (40.6413, -73.7781), KLGA (40.7769, -73.8740), KEWR (40.6895, -74.1745)

`approach` and `departure` are airport-agnostic — NY TRACON handles all three airports.

## ATC audio (`client/src/lib/atcStreams.ts`)

LiveATC.net streams `.pls` playlist files, not direct audio URLs. The server's `/api/stream?url=<encoded-pls-url>` endpoint fetches the `.pls` and extracts the `File1=` stream URL, which is passed directly to `<audio src>`.

Approach and departure both use the same NY TRACON stream for now (separate frequencies are a planned improvement).

## Phase colors

| Phase | Normal | Selected (darker) |
|-------|--------|-------------------|
| ground | `#9ca3af` (gray-400) | `#4b5563` (gray-600) |
| tower | `#f59e0b` (amber-400) | `#b45309` (amber-700) |
| approach | `#22d3ee` (cyan-400) | `#0891b2` (cyan-600) |
| departure | `#a78bfa` (violet-400) | `#7c3aed` (violet-600) |

## Planned / known gaps

- Multiple ATC frequencies per phase (e.g. JFK has two tower frequencies) — the multi-stream UI is the next planned feature
- Approach/departure streams are the same TRACON feed; real departure control is a separate frequency
- Airport filter only applies to ground/tower; approach/departure always show
