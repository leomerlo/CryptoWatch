import { createFileRoute } from '@tanstack/react-router'
import CoinPage from '@/pages/coins/coin'
import CoinPageSkeleton from '@/features/market/components/coin-detail/coin-page-skeleton'

export const Route = createFileRoute('/coins/$coinId')({
  component: CoinPage,
  pendingComponent: CoinPageSkeleton,
})
