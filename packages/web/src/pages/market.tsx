import { useCoins } from '@/features/market/api/use-coins'

const MarketPage = () => {
  const { data, isLoading, error } = useCoins({ page: 1, filters: { category: 'all' } })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <h1>Market</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default MarketPage
