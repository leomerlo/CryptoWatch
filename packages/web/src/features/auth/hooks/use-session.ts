import { supabase } from '@/shared/lib/supabase'
import { useEffect } from 'react'
import { useAppStore } from '@/stores'
import { router } from '@/app/router'
import type { Session } from '@supabase/supabase-js'

export function useSession() {
  const { session, setSession } = useAppStore()

  useEffect(() => {
    let mounted = true

    router.update({ context: { auth: { session: null, isLoading: true } } })
    router.invalidate()

    const sync = (session: Session | null, isLoading = false) => {
      setSession(session)
      router.update({
        context: { auth: { session, isLoading } },
      })
      router.invalidate()
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) sync(session, false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      sync(session, false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setSession])

  return session
}
