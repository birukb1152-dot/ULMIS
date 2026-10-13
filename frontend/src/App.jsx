import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import LandRequestsPage from './pages/citizen/LandRequestsPage'
import InfraReportsPage from './pages/citizen/InfraReportsPage'
import OfficerLandPage from './pages/officer/OfficerLandPage'
import OfficerInfraPage from './pages/officer/OfficerInfraPage'
import OfficerUsersPage from './pages/officer/OfficerUsersPage'
import OfficerMessagesPage from './pages/officer/OfficerMessagesPage'
import MapViewPage from './pages/MapViewPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import FAQPage from './pages/FAQPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import HelpCenterPage from './pages/HelpCenterPage'

function ProtectedRoute({ children, role }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { currentUser } = useApp()
  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      
      {/* Public Pages */}
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/help-center" element={<HelpCenterPage />} />
      
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/map" element={<MapViewPage />} />
        {/* Citizen routes */}
        <Route path="/land-requests" element={<ProtectedRoute role="citizen"><LandRequestsPage /></ProtectedRoute>} />
        <Route path="/infra-reports" element={<ProtectedRoute role="citizen"><InfraReportsPage /></ProtectedRoute>} />
        {/* Officer routes */}
        <Route path="/officer/land" element={<ProtectedRoute role="officer"><OfficerLandPage /></ProtectedRoute>} />
        <Route path="/officer/infra" element={<ProtectedRoute role="officer"><OfficerInfraPage /></ProtectedRoute>} />
        <Route path="/officer/users" element={<ProtectedRoute role="officer"><OfficerUsersPage /></ProtectedRoute>} />
        <Route path="/officer/messages" element={<ProtectedRoute role="officer"><OfficerMessagesPage /></ProtectedRoute>} />
        {/* Shared */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
