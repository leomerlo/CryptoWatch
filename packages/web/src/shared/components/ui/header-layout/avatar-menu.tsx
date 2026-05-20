import { UserIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../button'
import { useAppStore } from '@/stores'
import type { User } from '@supabase/supabase-js'

function getInitials(user: User) {
  const name = user.user_metadata?.full_name as string | undefined
  if (name)
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  return (user.email ?? '?')[0].toUpperCase()
}

function AvatarMenu() {
  const navigate = useNavigate()
  const { session } = useAppStore()

  if (!session)
    return (
      <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg" aria-label="Login">
        <UserIcon className="w-4 h-4" />
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-black capitalize">
            {session.user ? getInitials(session.user as User) : '?'}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: '/logout' })}>Logout</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { AvatarMenu }
