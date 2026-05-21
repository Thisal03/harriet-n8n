const fs = require('fs')
;(async () => {
  try {
    const envRaw = fs.readFileSync('.env.local', 'utf8')
    const env = Object.fromEntries(
      envRaw
        .split(/\r?\n/)
        .filter(Boolean)
        .map((l) => {
          const i = l.indexOf('=')
          return [l.slice(0, i), l.slice(i + 1)]
        })
    )

    const base = env.N8N_API_BASE_URL
    const key = env.N8N_API_KEY
    if (!base || !key) {
      console.error('Missing N8N_API_BASE_URL or N8N_API_KEY in .env.local')
      process.exit(2)
    }

    const url = `${base.replace(/\/$/, '')}/api/v1/workflows?limit=5`
    const res = await fetch(url, {
      headers: { 'X-N8N-API-KEY': key },
      cache: 'no-store',
    })

    const text = await res.text()
    console.log(text)
  } catch (e) {
    console.error('ERROR', e && e.message ? e.message : e)
    process.exit(1)
  }
})()
