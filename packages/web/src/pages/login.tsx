import { Button } from '@/shared/components/ui/button'
import { supabase } from '@/shared/lib/supabase'

export const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      <Button
        onClick={() => {
          supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: window.location.origin },
          })
        }}
      >
        Login with GitHub
      </Button>
      <Button
        onClick={() => {
          supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
          })
        }}
      >
        Login with Google
      </Button>
    </div>
  )
}
