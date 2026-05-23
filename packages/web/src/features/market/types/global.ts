import { z } from 'zod'

export const GlobalMarketSchema = z.object({
  data: z.object({
    total_market_cap: z.record(z.string(), z.number()),
    total_volume: z.record(z.string(), z.number()),
    market_cap_percentage: z.object({
      btc: z.number(),
      eth: z.number().optional(),
    }),
    market_cap_change_percentage_24h_usd: z.number().optional(),
    active_cryptocurrencies: z.number(),
    updated_at: z.number(),
  }),
})

export type GlobalMarket = z.infer<typeof GlobalMarketSchema>
