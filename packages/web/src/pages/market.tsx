import { CoinTableSection } from '@/features/market/components/coin-table/coin-table-section'
import MarketStats from '@/features/market/components/market-stats'

const MarketPage = () => {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <h1 className="text-2xl! font-bold! tracking-wide! mt-4! mb-0!">Market</h1>
      <MarketStats />
      <CoinTableSection />
    </div>
  )
}

export default MarketPage
