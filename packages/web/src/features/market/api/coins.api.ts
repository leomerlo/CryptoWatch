import type { Coin, CoinDetails, CoinOhlcCandle } from '@/features/market/types/coin'
import { parseCoinDetails, parseCoinOhlc, CoinSchema } from '@/features/market/types/coin'
import type { CoinHistoryTimeframe, CoinsListParams } from './coins.keys'
import { OHLC_DAYS_BY_TIMEFRAME } from './coin-history.params'
import { z } from 'zod'

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

export async function fetchCoinDetails(id: string): Promise<CoinDetails> {
  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/coins/${id}`)
  url.searchParams.set('localization', 'false')
  url.searchParams.set('tickers', 'false')
  url.searchParams.set('market_data', 'true')
  url.searchParams.set('community_data', 'false')
  url.searchParams.set('developer_data', 'false')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch coin details')

  const json = await res.json()
  return parseCoinDetails(json)
}

export async function fetchCoinOhlc(
  id: string,
  timeframe: CoinHistoryTimeframe
): Promise<CoinOhlcCandle[]> {
  const url = new URL(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/coins/${id}/ohlc`
  )
  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('days', OHLC_DAYS_BY_TIMEFRAME[timeframe].toString())

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch coin OHLC')

  const json = await res.json()
  return parseCoinOhlc(json)
}
