import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from '@/context/AppContext'
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

function ProtectedRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Login />} />
        <Route path="/speak"      element={<ProtectedRoute><Speak /></ProtectedRoute>} />
        <Route path="/phrases"    element={<ProtectedRoute><Phrases /></ProtectedRoute>} />
        <Route path="/voice-banking" element={<ProtectedRoute><VoiceBankingPage /></ProtectedRoute>} />
        <Route path="/archaeology"element={<ProtectedRoute><Archaeology /></ProtectedRoute>} />
        <Route path="/family"     element={<ProtectedRoute><Family /></ProtectedRoute>} />
        <Route path="/sign"       element={<ProtectedRoute><SignLanguage /></ProtectedRoute>} />
        <Route path="/settings"   element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
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
