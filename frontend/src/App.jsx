import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CampaignsPage from './pages/CampaignsPage'
import LeadsPage from './pages/LeadsPage'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import { Spinner } from './components/ui/spinner'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Spinner />
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'Admin' ? '/dashboard' : '/leads'} replace />
  }
  return children
}

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar role={user?.role} />
      <div className="flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} />
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

const HomeRedirect = () => {
  const { user, loading } = useAuth()
  if (loading) {
    return <Spinner />
  }
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'Admin' ? '/dashboard' : '/leads'} replace />
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['Admin']}>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute roles={['Admin', 'Data Entry']}>
            <AppLayout>
              <CampaignsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads"
        element={
          <ProtectedRoute roles={['Admin', 'Data Entry']}>
            <AppLayout>
              <LeadsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
