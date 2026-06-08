import { GlobalMarketSchema } from '@/features/market/types/global'

export async function fetchGlobalMarket(currency = 'usd') {
  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/global`)

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch global market data')

  const json = GlobalMarketSchema.parse(await res.json())
  const { data } = json

  return {
    totalMarketCap: data.total_market_cap[currency],
    volume24h: data.total_volume[currency],
    btcDominance: data.market_cap_percentage.btc,
    marketCapChange24h: data.market_cap_change_percentage_24h_usd,
    totalCoins: data.active_cryptocurrencies,
    updatedAt: data.updated_at,
  }
}
