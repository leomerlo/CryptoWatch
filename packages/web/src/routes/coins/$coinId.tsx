import { createFileRoute } from '@tanstack/react-router'
import CoinPage from '@/pages/coins/coin'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

export const Route = createFileRoute('/coins/$coinId')({
  component: CoinPage,
  pendingComponent: PageSkeleton,
})