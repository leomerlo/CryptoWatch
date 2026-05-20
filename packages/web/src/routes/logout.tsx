import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/shared/lib/supabase'

export const Route = createFileRoute('/logout')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.session) throw redirect({ to: '/login' })
    await supabase.auth.signOut()
    throw redirect({ to: '/' })
  },
})
