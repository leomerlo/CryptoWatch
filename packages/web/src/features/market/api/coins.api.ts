import type { Coin } from '@/features/market/types/coin'
import type { CoinsListParams } from './coins.keys'
import { z } from 'zod'
import { CoinSchema } from '@/features/market/types/coin'

export async function fetchCoinsList(params: CoinsListParams): Promise<Coin[]> {
  const { page, perPage, filters } = params

  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/coins/markets`)
  url.searchParams.set('page', page?.toString() ?? '1')
  url.searchParams.set('per_page', perPage?.toString() ?? '20')
  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('sparkline', 'true')
  url.searchParams.set('price_change_percentage', '24h')
  url.searchParams.set('order', 'market_cap_desc')

  if (filters?.category && filters.category !== 'all') {
    url.searchParams.set('category', filters.category as string)
  }

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch coins list')

  const json = await res.json()
  return z.array(CoinSchema).parse(json)
}

export async function fetchCoinDetails(id: string) {
  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/coins/${id}`)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch coin details')

  const json = await res.json()
  return CoinSchema.parse(json)
}
