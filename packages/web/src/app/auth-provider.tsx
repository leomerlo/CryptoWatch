import { useSession } from '@/features/auth/hooks/use-session'
import type { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  useSession()
  return children
}
