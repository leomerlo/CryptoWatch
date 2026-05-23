import MarketStats from '@/features/market/components/market-stats'
import CoinTable from '@/features/market/components/coin-table/coin-table'

const MarketPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl! font-bold! tracking-wide! mt-4! mb-0!">Market</h1>
      <MarketStats />
      <CoinTable />
    </div>
  )
}

export default MarketPage
