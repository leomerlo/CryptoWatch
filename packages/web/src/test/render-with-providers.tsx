import { render, type RenderOptions } from '@testing-library/react'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactElement } from 'react'

import { TestProviders } from '@/test/test-providers'

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & { queryClient?: QueryClient }
) {
  const { queryClient, ...renderOptions } = options ?? {}

  return render(ui, {
    wrapper: ({ children }) => <TestProviders queryClient={queryClient}>{children}</TestProviders>,
    ...renderOptions,
  })
}
