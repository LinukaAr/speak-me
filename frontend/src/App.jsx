import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { useApp } from '@/context/AppContext'
import Navbar from '@/components/layout/Navbar'
import Toast from '@/components/ui/Toast'
import Login from '@/pages/Login'
import Speak from '@/pages/Speak'
import Phrases from '@/pages/Phrases'
import Archaeology from '@/pages/Archaeology'
import Family from '@/pages/Family'
import SignLanguage from '@/pages/SignLanguage'
import Settings from '@/pages/Settings'
import VoiceBankingPage from '@/pages/VoiceBankingPage'
import About from '@/pages/About'

/**
 * Rehydrates AppContext user state whenever Asgardeo reports an active session.
 * Without this, refreshing on any protected route leaves `user` as null because
 * the Login component (which normally calls login()) never renders.
 */
function AuthSync() {
  const { state, getBasicUserInfo } = useAuthContext()
  const { user, login } = useApp()

  useEffect(() => {
    // Only run when authenticated and user isn't already loaded in context
    if (!state.isAuthenticated || user) return

    getBasicUserInfo()
      .then(info => {
        const email       = info?.email || info?.username || ''
        const displayName = info?.displayName || info?.givenName || info?.username || ''
        const userId      = info?.sub || info?.username || email
        login(email, displayName, userId)
      })
      .catch(() => {
        const email = state.username || ''
        login(email, '', email)
      })
  }, [state.isAuthenticated, user])

  return null
}

function SignoutPage() {
  const navigate = useNavigate()
  useEffect(() => { navigate('/', { replace: true }) }, [navigate])
  return null
}

function ProtectedRoute({ children }) {
  const { state } = useAuthContext()
  if (state.isLoading) return null
  return state.isAuthenticated ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <>
      <AuthSync />
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/"              element={<Login />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/signout"       element={<SignoutPage />} />
        <Route path="/speak"         element={<ProtectedRoute><Speak /></ProtectedRoute>} />
        <Route path="/phrases"       element={<ProtectedRoute><Phrases /></ProtectedRoute>} />
        <Route path="/voice-banking" element={<ProtectedRoute><VoiceBankingPage /></ProtectedRoute>} />
        <Route path="/archaeology"   element={<ProtectedRoute><Archaeology /></ProtectedRoute>} />
        <Route path="/family"        element={<ProtectedRoute><Family /></ProtectedRoute>} />
        <Route path="/sign"          element={<ProtectedRoute><SignLanguage /></ProtectedRoute>} />
        <Route path="/settings"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/about"         element={<About />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
