import { createFileRoute, redirect } from '@tanstack/react-router'
import WatchlistPage from '@/pages/watchlist'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

export const Route = createFileRoute('/watchlist')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.session) throw redirect({ to: '/login' })
  },
  component: WatchlistPage,
  pendingComponent: PageSkeleton,
})
