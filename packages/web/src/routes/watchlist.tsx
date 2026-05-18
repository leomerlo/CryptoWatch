import { createFileRoute, redirect } from '@tanstack/react-router'
import WatchlistPage from '@/pages/watchlist'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

const auth = { session: null }

export const Route = createFileRoute('/watchlist')({
  beforeLoad: async () => { if(!auth.session) throw redirect({ to: '/' }) },
  component: WatchlistPage,
  pendingComponent: PageSkeleton,
})