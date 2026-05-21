const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname.split('/coingecko').pop() ?? ''
  const upstream = new URL(`${COINGECKO_BASE}${path}`)
  upstream.search = url.search

  const res = await fetch(upstream, {
    headers: { 'x-cg-demo-api-key': Deno.env.get('COINGECKO_API_KEY')! },
  })

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // o tu origin de Vite
    },
  })
})