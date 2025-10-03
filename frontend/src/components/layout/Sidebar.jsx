import { NavLink } from 'react-router-dom'
import { BarChart2, FolderKanban, Users } from 'lucide-react'
import { cn } from '../../lib/utils'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart2, roles: ['Admin'] },
  { to: '/campaigns', label: 'Campaigns', icon: FolderKanban, roles: ['Admin', 'Data Entry'] },
  { to: '/leads', label: 'Leads', icon: Users, roles: ['Admin', 'Data Entry'] }
]

const Sidebar = ({ role }) => {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background p-6">
      <div className="mb-8 text-2xl font-semibold">Marketing IQ</div>
      <nav className="flex flex-col space-y-2">
        {links
          .filter(link => !role || link.roles.includes(role))
          .map(link => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground',
                    isActive && 'bg-primary text-primary-foreground'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            )
          })}
      </nav>
    </aside>
  )
}

export default Sidebar
