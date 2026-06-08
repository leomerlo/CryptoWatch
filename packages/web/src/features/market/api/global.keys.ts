export type GlobalMarketParams = {
  currency?: string
}

export const globalKeys = {
  all: ['global'] as const,
  markets: () => [...globalKeys.all, 'markets'] as const,
  market: (currency: string) => [...globalKeys.markets(), currency] as const,
}
