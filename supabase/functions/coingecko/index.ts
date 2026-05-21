const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const apiKey = Deno.env.get('COINGECKO_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing COINGECKO_API_KEY' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(req.url)
  const path = url.pathname.split('/coingecko').pop() ?? ''
  const upstream = new URL(`${COINGECKO_BASE}${path}`)
  upstream.search = url.search

  const res = await fetch(upstream, {
    headers: { 'x-cg-demo-api-key': apiKey },
  })

  return new Response(res.body, {
    status: res.status,
    headers: {
      ...corsHeaders,
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  })
})
