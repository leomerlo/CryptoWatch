import { createFileRoute, redirect } from '@tanstack/react-router'
import SettingsPage from '@/pages/settings'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

const auth = { session: null }

export const Route = createFileRoute('/settings')({
  beforeLoad: async () => { if(!auth.session) throw redirect({ to: '/' }) },
  component: SettingsPage,
  pendingComponent: PageSkeleton,
})