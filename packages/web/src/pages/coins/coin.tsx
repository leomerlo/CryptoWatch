import { getRouteApi } from '@tanstack/react-router'
import { useCoin } from '@/features/market/api/use-coins'

const coinRoute = getRouteApi('/coins/$coinId')

const CoinPage = () => {
  const { coinId } = coinRoute.useParams()
  const { data, isLoading } = useCoin(coinId)

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl! font-bold! tracking-wide! mt-4! mb-0!">
        CoinPage: {data?.name} {coinId}
      </h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg! font-bold! tracking-wide!">Coin Details</h2>
        </div>
      </div>
    </div>
  )
}

export default CoinPage
