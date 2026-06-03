import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { createTestQueryClient } from '@/test/create-test-query-client'

type TestProvidersProps = {
  children: ReactNode
  queryClient?: QueryClient
}

export function TestProviders({
  children,
  queryClient = createTestQueryClient(),
}: TestProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
