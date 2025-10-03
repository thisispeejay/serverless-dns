import { Sun, Moon, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useTheme } from '../../hooks/useTheme'

const Navbar = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-xl font-semibold">Marketing Performance Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor campaigns and leads in real-time</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="text-right">
          <div className="text-sm font-medium">{user?.fullName}</div>
          <div className="text-xs text-muted-foreground">{user?.role}</div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Navbar
