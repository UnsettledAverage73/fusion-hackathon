import React, { useState } from 'react'
import {
  Activity,
  Layers,
  Zap,
  Clock,
  CheckCircle2,
  Sparkles,
  BellRing,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { mockStats, mockRecords, sendSlackAlert } from '../../api/client'
import { formatDate } from '../../lib/utils'
import type { User } from '../../types'

interface DashboardViewProps {
  onQuickAction?: () => void
  user?: User | null
  onOpenAuth?: () => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onQuickAction,
  user,
  onOpenAuth,
}) => {
  const [slackSending, setSlackSending] = useState(false)
  const [slackResult, setSlackResult] = useState<{
    delivered: boolean
    message: string
  } | null>(null)

  const handleTriggerSlackAlert = async () => {
    try {
      setSlackSending(true)
      setSlackResult(null)
      const res = await sendSlackAlert({
        title: 'Fusion Hackathon Demo Alert',
        message:
          'Evaluator or presenter initiated a real-time event from the Fusion Hackathon Dashboard.',
        severity: 'CRITICAL',
        details: {
          User: user?.email || 'Anonymous Pitcher',
          Role: user?.role || 'Guest',
          Platform: 'Render Cloud + FastAPI',
          Timestamp: new Date().toLocaleTimeString(),
        },
      })
      setSlackResult(res)
    } catch (err: any) {
      setSlackResult({
        delivered: false,
        message: err.message || 'Network error triggering Slack alert',
      })
    } finally {
      setSlackSending(false)
    }
  }

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
            Frontend and Backend foundation armed with Google OAuth and Real-Time Slack Notification Service.
            Inject your problem statements directly into the workspace for instant judge demonstrations.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="md"
              onClick={handleTriggerSlackAlert}
              disabled={slackSending}
              leftIcon={<BellRing className="w-4 h-4 text-pink-400" />}
            >
              {slackSending ? 'Dispatching...' : 'Dispatch Live Slack Alert'}
            </Button>
            {onQuickAction && (
              <Button variant="outline" size="md" onClick={onQuickAction}>
                Trigger Quick Task
              </Button>
            )}
            {!user && onOpenAuth && (
              <Button variant="outline" size="md" onClick={onOpenAuth}>
                Authenticate User
              </Button>
            )}
          </div>

          {slackResult && (
            <div className="mt-4 p-3 rounded-xl border border-indigo-500/30 bg-slate-950/80 text-xs text-indigo-200 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{slackResult.message}</span>
            </div>
          )}
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
                <span className="text-2xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
                {stat.change && (
                  <span className="text-xs font-semibold text-emerald-400">
                    {stat.change}
                  </span>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Grid: Records & Free-for-Dev Feature Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Telemetry Activity Stream</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live events generated across the pipeline
                </p>
              </div>
              <Badge variant="default" className="text-[11px]">
                {mockRecords.length} Active Records
              </Badge>
            </CardHeader>
            <div className="divide-y divide-slate-800/80">
              {mockRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="py-3 px-1 flex items-center justify-between hover:bg-slate-800/20 rounded-lg transition px-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-200">{rec.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{rec.category}</span>
                      <span>•</span>
                      <span>By {rec.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        rec.status === 'completed'
                          ? 'success'
                          : rec.status === 'in_progress'
                          ? 'info'
                          : 'default'
                      }
                      className="capitalize text-[10px]"
                    >
                      {rec.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      {formatDate(rec.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Live Integrations Status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Integrated Services</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Free-tier stack active for demonstrations
              </p>
            </CardHeader>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Google OAuth 2.0</span>
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {user ? `Logged in as ${user.email}` : 'Ready for 1-click GIS / Demo sign-in'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Slack Webhooks</span>
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Block Kit rich cards enabled with zero third-party dependencies
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Render Deployment</span>
                  <Badge variant="success" className="text-[10px]">Live</Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  FastAPI Uvicorn + Vite Static Site on Render Cloud
                </p>
              </div>
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
