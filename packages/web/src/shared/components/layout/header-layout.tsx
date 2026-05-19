import { Link } from '@tanstack/react-router'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/components/ui/input-group'
import AvatarMenu from '@/shared/components/ui/header-layout/avatar-menu'
import HeaderNavigation from '@/shared/components/ui/header-layout/header-navigation'
import { SearchIcon } from 'lucide-react'

const HeaderLayout = () => {
  return (
    <header className="bg-background border-b border-b-muted">
      <div className="container mx-auto px-4 py-1 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/">
              <img src="/logo.svg" alt="CryptoWatch" className="w-10 h-10" />
            </Link>
            <div className="flex items-center gap-2">
              <HeaderNavigation />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <AvatarMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderLayout
