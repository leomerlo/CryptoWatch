import { z } from 'zod'

export const CoinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string().url(),
  current_price: z.number(),
  market_cap: z.number(),
  market_cap_rank: z.number().nullable(),
  total_volume: z.number(),
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

function usd(map: Record<string, number>): number {
  return map.usd ?? 0
}

function usdDate(map: Record<string, string>): string {
  return map.usd ?? ''
}

export function parseCoinDetails(data: unknown): CoinDetails {
  const raw = CoinGeckoDetailSchema.parse(data)
  const { market_data: md } = raw

  return {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    image: raw.image.large,
    currentPrice: usd(md.current_price),
    marketCap: usd(md.market_cap),
    marketCapRank: md.market_cap_rank ?? null,
    volume24h: usd(md.total_volume),
    ath: { price: usd(md.ath), date: usdDate(md.ath_date) },
    atl: { price: usd(md.atl), date: usdDate(md.atl_date) },
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
