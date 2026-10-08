import React from 'react'
import {
  LayoutDashboard,
  Heart,
  Calendar,
  ShieldAlert,
  Sliders,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { NavSection, UserRole } from '../../types'

interface SidebarProps {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void
  currentRole: UserRole
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  currentRole,
}) => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-tight leading-none">
              WellTrack
            </h1>
            <p className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase mt-1">
              Mood & Stress Tracker
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-3 mb-2">
            Student Wellness
          </div>

          <button
            onClick={() => setActiveSection('dashboard')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'dashboard'
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            )}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Dashboard & Trends</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('checkin')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'checkin'
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            )}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Daily Check-in</span>
            </div>
            <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
              60s
            </span>
          </button>

          <button
            onClick={() => setActiveSection('history')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'history'
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            )}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>History & Filter</span>
            </div>
          </button>

          <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-3 pt-5 mb-2">
            Campus Staff & Admin
          </div>

          <button
            onClick={() => setActiveSection('staff')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'staff'
                ? 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            )}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Support Signals</span>
            </div>
            <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
              3-Day Flag
            </span>
          </button>

          <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-3 pt-5 mb-2">
            System
          </div>

          <button
            onClick={() => setActiveSection('settings')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'settings'
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            )}
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-slate-400" />
              <span>API Configuration</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Bottom info widget */}
      <div className="p-4 border-t border-slate-900">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 capitalize">{currentRole} Session</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              Privacy Mode
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Private notes are strictly isolated and never shown on staff pages.
          </p>
        </div>
      </div>
    </aside>
  )
}
