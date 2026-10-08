import { useState } from 'react'
import { LandingPage } from './components/landing/LandingPage'
import { AuthModal } from './components/auth/AuthModal'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { StudentDashboardView } from './components/views/StudentDashboardView'
import { DailyCheckinView } from './components/views/DailyCheckinView'
import { HistoryView } from './components/views/HistoryView'
import { StaffDashboardView } from './components/views/StaffDashboardView'
import { SettingsView } from './components/views/SettingsView'
import { demoLogin } from './api/client'
import type { NavSection, UserRole, User } from './types'

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('student')
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard')
  const [currentRole, setCurrentRole] = useState<UserRole>('student')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Open Auth Modal
  const handleOpenAuth = (role: UserRole = 'student') => {
    setAuthDefaultRole(role)
    setIsAuthModalOpen(true)
  }

  // Handle successful login
  const handleAuthSuccess = (user: User, role: UserRole) => {
    setCurrentUser(user)
    setCurrentRole(role)
    setIsAuthenticated(true)
    setIsAuthModalOpen(false)
    setActiveSection(role === 'staff' ? 'staff' : 'dashboard')
    showToast(`Welcome back, ${user.name || (role === 'staff' ? 'Dr. Aris Thorne' : 'Atharva Dev')}!`)
  }

  // Handle one-click quick demo login from landing page
  const handleQuickDemo = async (role: UserRole) => {
    try {
      const res = await demoLogin(role)
      setCurrentUser(res.user)
      setCurrentRole(role)
      setIsAuthenticated(true)
      setActiveSection(role === 'staff' ? 'staff' : 'dashboard')
      showToast(
        role === 'staff'
          ? '🛡️ Counselor Command Center active (Dr. Aris Thorne)'
          : '🎓 Student Portal active (Atharva Dev)'
      )
    } catch {
      showToast('Connecting to demo account...')
      // Fallback local session
      setCurrentRole(role)
      setIsAuthenticated(true)
      setActiveSection(role === 'staff' ? 'staff' : 'dashboard')
    }
  }

  // Handle sign out / back to startup landing page
  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setActiveSection('dashboard')
    showToast('Signed out. Returned to WellTrack home.')
  }

  // Toggle role inside the app
  const handleToggleRole = () => {
    const nextRole: UserRole = currentRole === 'student' ? 'staff' : 'student'
    setCurrentRole(nextRole)
    demoLogin(nextRole).then((res) => {
      if (res?.user) setCurrentUser(res.user)
      showToast(
        nextRole === 'staff'
          ? 'Switched to Counselor Portal (Dr. Aris Thorne)'
          : 'Switched to Student Portal (Atharva Dev)'
      )
      setActiveSection(nextRole === 'staff' ? 'staff' : 'dashboard')
    })
  }

  const handleSeedComplete = () => {
    showToast('✨ Demo data seeded successfully! 3-day stress streak loaded.')
    setRefreshKey((k) => k + 1)
  }

  // If unauthenticated: Display High-Converting Venture Startup Landing Page
  if (!isAuthenticated) {
    return (
      <>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400/30 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <span>🔔</span>
            <span>{toastMessage}</span>
          </div>
        )}

        <LandingPage
          onOpenAuth={handleOpenAuth}
          onQuickDemo={handleQuickDemo}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          defaultRole={authDefaultRole}
        />
      </>
    )
  }

  // If authenticated: Display Protected Portal (Student or Counselor)
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400/30 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentRole={currentRole}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentRole={currentRole}
          currentUser={currentUser}
          onToggleRole={handleToggleRole}
          onSeedComplete={handleSeedComplete}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto" key={refreshKey}>
          {activeSection === 'dashboard' && (
            <StudentDashboardView onNavigate={setActiveSection} />
          )}
          {activeSection === 'checkin' && (
            <DailyCheckinView
              onCheckinSuccess={() => {
                showToast('Check-in saved successfully! Streak updated.')
                setActiveSection('dashboard')
                setRefreshKey((k) => k + 1)
              }}
              onNavigate={setActiveSection}
            />
          )}
          {activeSection === 'history' && <HistoryView />}
          {activeSection === 'staff' && <StaffDashboardView />}
          {activeSection === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Auth Modal for re-authenticating if desired */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultRole={authDefaultRole}
      />
    </div>
  )
}

export default App
