import type { Coin, CoinDetails, CoinOhlcCandle } from '@/features/market/types/coin'
import { parseCoinDetails, parseCoinOhlc, CoinSchema } from '@/features/market/types/coin'
import type { CoinHistoryTimeframe, CoinsListParams } from './coins.keys'
import { OHLC_DAYS_BY_TIMEFRAME } from './coin-history.params'
import { z } from 'zod'
import type { Currency } from '@/shared/slices/ui-slice'

export async function fetchCoinsList(params: CoinsListParams): Promise<Coin[]> {
  const { page, perPage, filters, currency } = params

  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/coins/markets`)
  url.searchParams.set('page', page?.toString() ?? '1')
  url.searchParams.set('per_page', perPage?.toString() ?? '20')
  url.searchParams.set('vs_currency', currency ?? 'usd')
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

export async function fetchCoinDetails(id: string, currency: Currency): Promise<CoinDetails> {
  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/coins/${id}`)
  url.searchParams.set('localization', 'false')
  url.searchParams.set('tickers', 'false')
  url.searchParams.set('market_data', 'true')
  url.searchParams.set('community_data', 'false')
  url.searchParams.set('developer_data', 'false')
  url.searchParams.set('vs_currency', currency)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch coin details')

  const json = await res.json()
  return parseCoinDetails(json, currency)
}

export async function fetchCoinOhlc(
  id: string,
  timeframe: CoinHistoryTimeframe,
  currency: Currency
): Promise<CoinOhlcCandle[]> {
  const url = new URL(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko/coins/${id}/ohlc`
  )
  url.searchParams.set('vs_currency', currency)
  url.searchParams.set('days', OHLC_DAYS_BY_TIMEFRAME[timeframe].toString())

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch coin OHLC')

  const json = await res.json()
  return parseCoinOhlc(json)
}
