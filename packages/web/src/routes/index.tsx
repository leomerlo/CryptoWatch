import { createFileRoute } from '@tanstack/react-router'
import MarketPage from '@/pages/market';
import { MarketSkeleton } from '@/shared/components/ui/market-skeleton';


export const Route = createFileRoute('/')({
  component: MarketPage,
  pendingComponent: MarketSkeleton,
})