import React, { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { DashboardView } from './components/views/DashboardView'
import { PlaygroundView } from './components/views/PlaygroundView'
import { RecordsView } from './components/views/RecordsView'
import { SettingsView } from './components/views/SettingsView'
import { AuthModal } from './components/auth/AuthModal'
import { Modal } from './components/ui/Modal'
import { Input } from './components/ui/Input'
import { Button } from './components/ui/Button'
import { getMe, getSavedUser, logoutUser } from './api/client'
import type { NavSection, User } from './types'

export function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('AI / ML')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    // Restore saved user session if token exists
    const saved = getSavedUser()
    if (saved) {
      setUser(saved)
      getMe()
        .then((fresh) => setUser(fresh))
        .catch(() => {
          // Token expired or invalid
        })
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    showToast('Signed out successfully.')
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      })
    } catch {
      // ignore
    }

    showToast(`Task "${newTitle}" registered successfully!`)
    setNewTitle('')
    setIsCreateModalOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400/30 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenNewAction={() => setIsCreateModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <DashboardView
              onQuickAction={() => setIsCreateModalOpen(true)}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}
          {activeSection === 'playground' && <PlaygroundView />}
          {activeSection === 'records' && (
            <RecordsView onAddNew={() => setIsCreateModalOpen(true)} />
          )}
          {activeSection === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Google OAuth & Demo Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser)
          showToast(`Welcome back, ${loggedUser.full_name || loggedUser.email}!`)
        }}
      />

      {/* Quick Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Trigger New Pipeline Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Pipeline Task Name"
            placeholder="e.g. Real-time RAG query, Batch analysis..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            required
          />

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="AI / ML">AI / ML</option>
              <option value="Database">Database</option>
              <option value="Search Engine">Search Engine</option>
              <option value="Auth & Security">Auth & Security</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Initialize Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
export default App
