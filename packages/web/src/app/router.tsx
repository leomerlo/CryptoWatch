import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { PageSkeleton } from '@/shared/components/ui/page-skeleton'

export const router = createRouter({
  routeTree,
  context: {
    auth: { session: null, isLoading: true },
  },
  defaultPendingComponent: PageSkeleton,
  defaultPendingMs: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}