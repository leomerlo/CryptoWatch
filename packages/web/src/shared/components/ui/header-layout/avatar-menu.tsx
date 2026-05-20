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

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
}

function AvatarMenu() {
  const navigate = useNavigate()
  const { session } = useAppStore()

  if (!session?.user)
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
            {getInitials(session.user.email!)}
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
