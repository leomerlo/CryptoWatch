import { useQueryClient } from '@tanstack/react-query'
import { coinDetailQueryOptions } from './coins.options'
import { coinsKeys } from './coins.keys'
import { useAppStore } from '@/stores'

export function usePrefetchCoin() {
  const queryClient = useQueryClient()
  const currency = useAppStore((s) => s.currency)

  return (coinId: string) => {
    const queryKey = coinsKeys.detail(coinId, currency)
    const state = queryClient.getQueryState(queryKey)

    if (state?.fetchStatus === 'fetching') return
    if (state?.status === 'success') return

    void queryClient.prefetchQuery(coinDetailQueryOptions(coinId, currency))
  }
}
