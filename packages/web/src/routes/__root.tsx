import type { Session } from '@supabase/supabase-js';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

type RouterContext = {
  auth: { session: Session | null; isLoading: boolean }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
})