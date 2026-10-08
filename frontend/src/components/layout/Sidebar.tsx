import React from 'react'
import {
  LayoutDashboard,
  Cpu,
  Database,
  Sliders,
  Flame,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { NavSection } from '../../types'

interface SidebarProps {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void
}

interface NavMenuItem {
  id: NavSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navItems: NavMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'playground', label: 'AI Studio', icon: Cpu, badge: 'Active' },
  { id: 'records', label: 'Data Hub', icon: Database },
  { id: 'settings', label: 'Configuration', icon: Sliders },
]

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-tight leading-none">
              Fusion Hackathon
            </h1>
            <p className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase mt-1">
              Hackathon Edition
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isActive ? 'text-indigo-400' : 'text-slate-500'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom info widget */}
      <div className="p-4 border-t border-slate-900">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Hackathon Build</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Ready to plug problem statement logic.
          </p>
        </div>
      </div>
    </aside>
  )
}
