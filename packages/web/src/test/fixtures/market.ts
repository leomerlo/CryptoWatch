import type { Coin } from '@/features/market/types/coin'

export const mockCoin: Coin = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/btc.png',
  current_price: 50_000,
  market_cap: 1_000_000_000_000,
  market_cap_rank: 1,
  total_volume: 50_000_000_000,
  price_change_percentage_24h: 2.5,
  sparkline_in_7d: { price: [48_000, 49_000, 50_000, 51_000] },
}

export const mockEthereum: Coin = {
  id: 'ethereum',
  symbol: 'eth',
  name: 'Ethereum',
  image: 'https://example.com/eth.png',
  current_price: 3_000,
  market_cap: 400_000_000_000,
  market_cap_rank: 2,
  total_volume: 20_000_000_000,
  price_change_percentage_24h: -1.2,
  sparkline_in_7d: { price: [2_900, 3_000, 2_950] },
}

export const mockGlobalMarket = {
  totalMarketCap: 2_500_000_000_000,
  volume24h: 120_000_000_000,
  btcDominance: 52.34,
  marketCapChange24h: 1.2,
  totalCoins: 100,
  updatedAt: 1_700_000_000,
}
