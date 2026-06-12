import { useQuery } from '@tanstack/react-query'
import { fetchGlobalMarket } from '@/features/market/api/global.api'
import type { Currency } from '@/shared/slices/ui-slice'

export function useGlobalMarket(currency: Currency) {
  return useQuery({
    queryKey: ['global-market', currency],
    queryFn: () => fetchGlobalMarket(currency),
    staleTime: 60_000,
  })
}
