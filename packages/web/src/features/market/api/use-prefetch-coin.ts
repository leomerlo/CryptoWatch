import { useQueryClient } from '@tanstack/react-query'
import { coinDetailQueryOptions } from './coins.options'
import { coinsKeys } from './coins.keys'

export function usePrefetchCoin() {
  const queryClient = useQueryClient()

  return (coinId: string) => {
    const queryKey = coinsKeys.detail(coinId)
    const state = queryClient.getQueryState(queryKey)

    if (state?.fetchStatus === 'fetching') return
    if (state?.status === 'success') return

    void queryClient.prefetchQuery(coinDetailQueryOptions(coinId))
  }
}
