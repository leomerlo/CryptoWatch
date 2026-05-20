import { createFileRoute, redirect } from '@tanstack/react-router'
import AlertsPage from '@/pages/alerts'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

export const Route = createFileRoute('/alerts')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.session) throw redirect({ to: '/login' })
  },
  component: AlertsPage,
  pendingComponent: PageSkeleton,
})
