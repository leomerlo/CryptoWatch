import { Link } from '@tanstack/react-router'
import { cva } from 'class-variance-authority'

const navItemVariants = cva('border-b-2 transition-all duration-300 p-4 pb-3', {
  variants: {
    active: {
      true: 'border-primary text-primary',
      false: 'border-transparent text-muted-foreground',
    },
  },
  defaultVariants: {
    active: false,
  },
})

type HeaderNavItemProps = {
  to: string
  exact?: boolean
  children: React.ReactNode
}

function HeaderNavItem({ to, exact, children }: HeaderNavItemProps) {
  return (
    <li>
      <Link
        to={to}
        inactiveProps={{ className: navItemVariants({ active: false }) }}
        activeProps={{ className: navItemVariants({ active: true }) }}
        activeOptions={exact ? { exact: true } : undefined}
      >
        {children}
      </Link>
    </li>
  )
}

const HeaderNavigation = () => {
  return (
    <nav>
      <ul className="flex items-center gap-2">
        <HeaderNavItem to="/" exact>
          Market
        </HeaderNavItem>
        <HeaderNavItem to="/watchlist">Watchlist</HeaderNavItem>
        <HeaderNavItem to="/alerts">Alerts</HeaderNavItem>
      </ul>
    </nav>
  )
}

export { HeaderNavigation }
