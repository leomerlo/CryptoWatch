import { createFileRoute, redirect } from '@tanstack/react-router'
import AlertsPage from '@/pages/alerts'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

const auth = { session: null }

export const Route = createFileRoute('/alerts')({
  beforeLoad: async () => { if(!auth.session) throw redirect({ to: '/' }) },
  component: AlertsPage,
  pendingComponent: PageSkeleton,
})