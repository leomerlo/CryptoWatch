import type { Coin, CoinDetails, CoinOhlcCandle } from '@/features/market/types/coin'

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

/** Raw CoinGecko /coins/{id} payload fragment for API tests. */
export const mockCoinGeckoDetailRaw = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: {
    large: 'https://example.com/btc.png',
  },
  market_data: {
    current_price: { usd: 50_000 },
    market_cap: { usd: 1_000_000_000_000 },
    market_cap_rank: 1,
    total_volume: { usd: 50_000_000_000 },
    ath: { usd: 69_000 },
    ath_date: { usd: '2021-11-10T14:24:11.849Z' },
    atl: { usd: 67.81 },
    atl_date: { usd: '2013-07-06T00:00:00.000Z' },
    circulating_supply: 19_500_000,
    max_supply: 21_000_000,
    max_supply_infinite: false,
  },
}

export const mockCoinDetails: CoinDetails = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/btc.png',
  currentPrice: 50_000,
  marketCap: 1_000_000_000_000,
  marketCapRank: 1,
  volume24h: 50_000_000_000,
  ath: { price: 69_000, date: '2021-11-10T14:24:11.849Z' },
  atl: { price: 67.81, date: '2013-07-06T00:00:00.000Z' },
  circulatingSupply: 19_500_000,
  maxSupply: 21_000_000,
}

export const mockCoinOhlc: CoinOhlcCandle[] = [
  { timestamp: 1_700_000_000_000, open: 48_000, high: 49_500, low: 47_800, close: 49_000 },
  { timestamp: 1_700_086_400_000, open: 49_000, high: 50_200, low: 48_500, close: 50_000 },
  { timestamp: 1_700_172_800_000, open: 50_000, high: 51_000, low: 49_200, close: 49_800 },
]

export const mockGlobalMarket = {
  totalMarketCap: 2_500_000_000_000,
  volume24h: 120_000_000_000,
  btcDominance: 52.34,
  marketCapChange24h: 1.2,
  totalCoins: 100,
  updatedAt: 1_700_000_000,
}
