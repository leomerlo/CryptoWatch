import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,
      staleTime: 60_000,
      retry: (failureCount, error) => {
        return (
          failureCount < 2 &&
          error instanceof Error &&
          !error.message.includes('404') &&
          !error.message.includes('401')
        )
      },
      refetchInterval: 60_000,
      refetchOnWindowFocus: true,
    },
  },
})

// TypeScript only:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient
  }
}

if (import.meta.env.DEV) {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient
}
