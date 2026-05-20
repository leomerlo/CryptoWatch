import { createFileRoute, redirect } from '@tanstack/react-router'
import SettingsPage from '@/pages/settings'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

export const Route = createFileRoute('/settings')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.session) throw redirect({ to: '/login' })
  },
  component: SettingsPage,
  pendingComponent: PageSkeleton,
})
