import express from 'express'
import cors from 'cors'
import { startPoller } from './poller.js'
import { getCache } from './cache.js'

const PORT = Number(process.env.PORT ?? 3001)
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS ?? 12000)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/aircraft', (_req, res) => {
  const { aircraft, stale } = getCache()
  if (stale) res.setHeader('X-Cache-Stale', 'true')
  res.setHeader('Cache-Control', 'public, max-age=10')
  res.json({ aircraft })
})

app.get('/api/stream', async (req, res) => {
  const url = req.query.url as string
  if (!url) { res.status(400).json({ error: 'url required' }); return }

  try {
    const plsRes = await fetch(url)
    if (!plsRes.ok) {
      res.status(plsRes.status).json({ error: `Upstream error: ${plsRes.statusText || plsRes.status}` })
      return
    }
    const text = await plsRes.text()
    const match = text.match(/^File1=(.+)$/m)
    if (!match) throw new Error('no File1 in pls')
    res.json({ streamUrl: match[1].trim() })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() })
})

app.listen(PORT, () => {
  console.log(`[server] listening on :${PORT}`)
  startPoller(POLL_INTERVAL_MS)
})
