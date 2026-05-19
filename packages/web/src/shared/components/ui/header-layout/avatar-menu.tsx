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

export default function AvatarMenu() {
  const navigate = useNavigate()

  return (
    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg" aria-label="Login">
      <UserIcon className="w-4 h-4" />
    </Button>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-8 h-8 rounded-lg bg-gray-200">
          <img
            src="https://github.com/shadcn.png"
            alt="Avatar"
            className="w-full h-full rounded-lg"
          />
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
