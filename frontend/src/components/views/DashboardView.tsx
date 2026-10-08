import React from 'react'
import {
  TrendingUp,
  Activity,
  Layers,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { mockStats, mockRecords } from '../../api/client'
import { formatDate } from '../../lib/utils'

interface DashboardViewProps {
  onQuickAction?: () => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onQuickAction }) => {
  return (
    <div className="space-y-6">
      {/* Hero / Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Scaffolding Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Fusion Hackathon Workspace Active
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Frontend foundation is armed and ready. Once tomorrow's problem statement drops,
            inject the target user flows directly into the AI Studio and Data Hub.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Button size="md" onClick={onQuickAction} leftIcon={<Zap className="w-4 h-4" />}>
              Launch Test Action
            </Button>
            <Button variant="outline" size="md">
              View Problem Checklist
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat, idx) => {
          const icons = [Layers, Activity, Clock, Zap]
          const Icon = icons[idx % icons.length]
          return (
            <Card key={stat.id} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-100">{stat.value}</span>
                {stat.change && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Content Split: Activity Log & Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent System Operations</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time activity simulated from mock service
                </p>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                All Logs
              </Button>
            </CardHeader>

            <div className="divide-y divide-slate-800/80">
              {mockRecords.map((rec) => (
                <div key={rec.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200 truncate">{rec.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{rec.category}</span>
                      <span>•</span>
                      <span>{formatDate(rec.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <Badge
                      variant={
                        rec.status === 'completed'
                          ? 'success'
                          : rec.status === 'in_progress'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {rec.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Hackathon Checklist / Architecture Card */}
        <div>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>Pitch Readiness</CardTitle>
              </CardHeader>
              <p className="text-xs text-slate-400 mb-4">
                Verify these key elements during presentation:
              </p>

              <ul className="space-y-3">
                {[
                  'Instant response demo (no waiting for slow backend)',
                  'Visually striking metrics & charts for judges',
                  'Clear user journey with minimal clicks',
                  'Responsive on laptop and mobile viewports',
                  'Toast notifications for every user action',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Backend Status
              </span>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Render Cloud: Live (Fusion Hackathon)
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
