import { useQuery } from '@tanstack/react-query'
import { fetchGlobalMarket } from '@/features/market/api/global.api'

export function useGlobalMarket(currency = 'usd') {
  return useQuery({
    queryKey: ['global-market', currency],
    queryFn: () => fetchGlobalMarket(currency),
    staleTime: 60_000,
  })
}
