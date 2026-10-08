import { useEffect, useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Flame,
  AlertTriangle,
  Heart,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { getDashboardSummary, getDashboardTrends } from '../../api/client'
import type { DashboardSummary, DashboardTrends, NavSection } from '../../types'

interface StudentDashboardViewProps {
  onNavigate: (section: NavSection) => void
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [trends, setTrends] = useState<DashboardTrends | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showHelplineModal, setShowHelplineModal] = useState(false)

  useEffect(() => {
    let mounted = true
    Promise.all([getDashboardSummary(), getDashboardTrends()])
      .then(([s, t]) => {
        if (mounted) {
          setSummary(s)
          setTrends(t)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const moodEmojis: Record<string, string> = {
    great: '😄',
    happy: '🙂',
    neutral: '😐',
    sad: '😔',
    very_low: '😣',
  }

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading student wellbeing trends...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner & CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Wellbeing Check-in</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Good morning, {summary?.student_name || 'Atharva'} 👋
            </h1>
            <p className="mt-1.5 text-sm text-slate-300 max-w-xl">
              Track how your mood and stress change over the week. Building daily self-awareness
              helps catch exam burnout before it builds up.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => onNavigate('checkin')}
              leftIcon={<Heart className="w-4 h-4 text-rose-400" />}
            >
              {summary?.today_status.completed ? 'Update Today’s Check-in' : 'Log Today’s Check-in'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowHelplineModal(true)}
              leftIcon={<PhoneCall className="w-4 h-4 text-emerald-400" />}
            >
              Campus Support
            </Button>
          </div>
        </div>
      </div>

      {/* Supportive Wellbeing Insight Banner */}
      {summary?.wellbeing_insight && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
            summary.today_status.stress_level && summary.today_status.stress_level >= 4
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-200'
          }`}
        >
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-white">Wellbeing Observation</h4>
              {trends?.support_signal_active && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase tracking-wider">
                  Support Signal Triggered
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {summary.wellbeing_insight}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Status */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Check-in</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {summary?.today_status.completed ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl">{moodEmojis[summary.today_status.mood || 'neutral']}</span>
                <div>
                  <div className="text-sm font-semibold text-white">Stress {summary.today_status.stress_level}/5</div>
                  <div className="text-[11px] text-emerald-400 font-medium">Recorded for today</div>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-lg font-bold text-amber-400">Pending</span>
                <p className="text-xs text-slate-400 mt-0.5">Take 60s to log how you feel</p>
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: 7-Day Average Stress */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>7-Day Avg Stress</span>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
              <span className="text-xs font-mono font-bold">1-5</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {summary?.average_stress ?? 3.7}
              <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
            </span>
            <Badge variant={summary && summary.average_stress >= 4 ? 'error' : summary && summary.average_stress >= 3 ? 'warning' : 'success'}>
              {summary && summary.average_stress >= 4 ? 'High' : summary && summary.average_stress >= 3 ? 'Moderate' : 'Healthy'}
            </Badge>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Based on {summary?.week_checkins_count || 7} logged days</p>
        </Card>

        {/* Card 3: Stress Trajectory */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Stress Trajectory</span>
            {summary?.stress_trend === 'increasing' ? (
              <TrendingUp className="w-4 h-4 text-rose-400" />
            ) : summary?.stress_trend === 'decreasing' ? (
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            ) : (
              <Minus className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="mt-3">
            <span className={`text-xl font-bold capitalize ${
              summary?.stress_trend === 'increasing' ? 'text-rose-400' : summary?.stress_trend === 'decreasing' ? 'text-emerald-400' : 'text-slate-200'
            }`}>
              {summary?.stress_trend === 'increasing' ? 'Increasing ↑' : summary?.stress_trend === 'decreasing' ? 'Improving ↓' : 'Stable →'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Compared against early week baseline</p>
        </Card>

        {/* Card 4: Consecutive Streak */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Check-in Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{summary?.streak_days || 7}</span>
            <span className="text-xs text-amber-400 font-medium">Consecutive Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Keep building your personal habit</p>
        </Card>
      </div>

      {/* 7-Day Visual Trend Chart Section */}
      <Card className="p-6">
        <CardHeader>
          <div>
            <CardTitle>7-Day Mood & Stress Trajectory</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual progression of daily stress (1–5 scale) and logged mood
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-500" />
              <span className="text-slate-300">Stress (1–3 Normal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span className="text-slate-300">Stress (4–5 Elevated)</span>
            </div>
          </div>
        </CardHeader>

        {/* Bar & Mood Curve Visualization */}
        <div className="mt-6 pt-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pb-6 border-b border-slate-800">
            {trends?.history_7d.map((day, idx) => {
              const isHigh = day.stress >= 4
              const barHeightPct = Math.max((day.stress / 5) * 100, 10)
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  {/* Mood Emoji on top */}
                  <span className="text-lg sm:text-2xl mb-2 transition transform group-hover:scale-125">
                    {moodEmojis[day.mood] || '😐'}
                  </span>

                  {/* Stress Bar */}
                  <div className="w-full max-w-[3rem] bg-slate-800/80 rounded-t-lg relative flex flex-col justify-end overflow-hidden h-36">
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className={`w-full rounded-t transition-all duration-500 flex items-center justify-center text-xs font-bold text-white shadow-md ${
                        isHigh ? 'bg-gradient-to-t from-rose-600 to-rose-400' : 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                      }`}
                    >
                      {day.stress > 0 && <span>{day.stress}</span>}
                    </div>
                  </div>

                  {/* Day Name */}
                  <span className="text-xs font-medium text-slate-300 mt-2">{day.day}</span>
                  <span className="text-[10px] text-slate-500">{day.date.slice(5)}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Stress threshold line at Level 4 triggers proactive support signal if maintained for 3+ days.</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('history')} rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              View Full History Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Campus Helpline Modal */}
      {showHelplineModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Campus Wellbeing Contacts
              </h3>
              <button
                onClick={() => setShowHelplineModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Your mental wellness comes first. Reach out anytime — all consultations are confidential.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">Campus Counseling Center</div>
                <div className="text-indigo-400 mt-0.5">📞 +1 (800) 273-TALK / Ext 4402</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Mon–Fri: 8:00 AM – 8:00 PM • Health Center Bldg B</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">24/7 Crisis Helpline</div>
                <div className="text-emerald-400 mt-0.5">Text 'SUPPORT' to 741741</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Free, confidential peer support available 24/7</div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" className="w-full" onClick={() => setShowHelplineModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
