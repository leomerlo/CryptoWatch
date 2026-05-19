import ErrorPage from '@/pages/error'
import type { Session } from '@supabase/supabase-js'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { MainShell } from '@/shared/components/layout/main-shell'

type RouterContext = {
  auth: { session: Session | null; isLoading: boolean }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <MainShell>
      <Outlet />
    </MainShell>
  ),
  errorComponent: ErrorPage,
})
