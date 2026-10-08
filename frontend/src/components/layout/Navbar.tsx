import React, { useEffect, useState } from 'react'
import { Search, Bell, Plus, Globe, LogIn, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { getHealthStatus, API_BASE_URL } from '../../api/client'
import type { User } from '../../types'

interface NavbarProps {
  onOpenNewAction?: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  user: User | null
  onOpenAuth: () => void
  onLogout: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewAction,
  searchQuery,
  setSearchQuery,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    getHealthStatus()
      .then((res) => {
        if (mounted && res.status === 'ok') setIsBackendOnline(true)
      })
      .catch(() => {
        if (mounted) setIsBackendOnline(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, prompts, records..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Render Live Backend Badge */}
        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noreferrer"
          title={`Backend API: ${API_BASE_URL}`}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-mono hover:bg-emerald-900/40 transition"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {isBackendOnline === true
              ? 'Render: Online'
              : isBackendOnline === false
              ? 'Render: Offline'
              : 'Render: Checking...'}
          </span>
        </a>

        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {onOpenNewAction && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenNewAction}
          >
            Create
          </Button>
        )}

        {/* User Account / Auth Actions */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 transition"
            >
              <span className="text-xs text-slate-200 font-medium max-w-[120px] truncate hidden md:inline">
                {user.full_name || user.email.split('@')[0]}
              </span>
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.full_name || 'User avatar'}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                  {(user.full_name || user.email)[0].toUpperCase()}
                </div>
              )}
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {user.full_name || 'Fusion User'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false)
                    onLogout()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/50 hover:text-red-300 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<LogIn className="w-4 h-4 text-indigo-400" />}
            onClick={onOpenAuth}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  )
}
