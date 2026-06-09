import type { Currency } from '@/shared/slices/ui-slice'
import { z } from 'zod'

export const CoinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string().url(),
  current_price: z.number(),
  market_cap: z.number(),
  market_cap_rank: z.number().nullable(),
  total_volume: z.number().nullable(),
  price_change_percentage_24h: z.number().nullable(),
  sparkline_in_7d: z.object({ price: z.array(z.number()) }).nullable(),
})

export type Coin = z.infer<typeof CoinSchema>

const FiatMapSchema = z.record(z.string(), z.number())
const FiatDateMapSchema = z.record(z.string(), z.string())

const CoinGeckoDetailSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.object({
    large: z.string().url(),
  }),
  market_data: z.object({
    current_price: FiatMapSchema,
    market_cap: FiatMapSchema,
    market_cap_rank: z.number().nullable(),
    total_volume: FiatMapSchema,
    ath: FiatMapSchema,
    ath_date: FiatDateMapSchema,
    atl: FiatMapSchema,
    atl_date: FiatDateMapSchema,
    circulating_supply: z.number().nullable(),
    max_supply: z.number().nullable(),
    max_supply_infinite: z.boolean().optional(),
  }),
})

export type CoinPricePoint = {
  price: number
  date: string
}

export type CoinDetails = {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapRank: number | null
  volume24h: number
  ath: CoinPricePoint
  atl: CoinPricePoint
  circulatingSupply: number | null
  maxSupply: number | null
}

function currencyMap(map: Record<string, number>, currency: Currency): number {
  return map[currency.toLowerCase()] ?? 0
}

function currencyDate(map: Record<string, string>, currency: Currency): string {
  return map[currency.toLowerCase()] ?? ''
}

export function parseCoinDetails(data: unknown, currency: Currency): CoinDetails {
  const raw = CoinGeckoDetailSchema.parse(data)
  const { market_data: md } = raw

  return {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    image: raw.image.large,
    currentPrice: currencyMap(md.current_price, currency),
    marketCap: currencyMap(md.market_cap, currency),
    marketCapRank: md.market_cap_rank ?? null,
    volume24h: currencyMap(md.total_volume, currency),
    ath: { price: currencyMap(md.ath, currency), date: currencyDate(md.ath_date, currency) },
    atl: { price: currencyMap(md.atl, currency), date: currencyDate(md.atl_date, currency) },
    circulatingSupply: md.circulating_supply,
    maxSupply: md.max_supply_infinite ? null : md.max_supply,
  }
}

export const CoinOhlcRowSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
])

export const CoinOhlcResponseSchema = z.array(CoinOhlcRowSchema)

export type CoinOhlcCandle = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

export function parseCoinOhlc(data: unknown): CoinOhlcCandle[] {
  return CoinOhlcResponseSchema.parse(data).map(([timestamp, open, high, low, close]) => ({
    timestamp,
    open,
    high,
    low,
    close,
  }))
}
