import { useEffect, useState } from 'react'
import { Search, Lock } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { getCheckinHistory } from '../../api/client'
import type { CheckIn } from '../../types'

export const HistoryView: React.FC = () => {
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | '7d' | '30d'>('all')

  const fetchHistory = (from?: string, to?: string, query?: string) => {
    setIsLoading(true)
    getCheckinHistory({ from, to, search: query })
      .then((data) => {
        setCheckins(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleApplyFilter = () => {
    setActiveFilter('all')
    fetchHistory(fromDate || undefined, toDate || undefined, search || undefined)
  }

  const handlePresetFilter = (preset: 'all' | '7d' | '30d') => {
    setActiveFilter(preset)
    const now = new Date()
    let startStr = ''
    const endStr = now.toISOString().slice(0, 10)

    if (preset === '7d') {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      startStr = start.toISOString().slice(0, 10)
    } else if (preset === '30d') {
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      startStr = start.toISOString().slice(0, 10)
    }

    setFromDate(startStr)
    setToDate(endStr)
    fetchHistory(startStr || undefined, endStr || undefined, search || undefined)
  }

  const moodEmojis: Record<string, string> = {
    great: '😄',
    happy: '🙂',
    neutral: '😐',
    sad: '😔',
    very_low: '😣',
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Check-in History & Logs</h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and inspect your past reflections and stress patterns across any timeframe.
          </p>
        </div>
      </div>

      {/* Filter and Date Range Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Preset range pill buttons */}
          <div className="flex items-center gap-2">
            {(['all', '7d', '30d'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetFilter(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeFilter === preset
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset === 'all' ? 'All Logs' : preset === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>

          {/* Search by note */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
              placeholder="Search private notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Custom Date Pickers */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span>To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Button size="sm" variant="secondary" onClick={handleApplyFilter}>
            Apply Custom Filter
          </Button>
        </div>
      </Card>

      {/* History Timeline */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading check-in history...</div>
        ) : checkins.length === 0 ? (
          <Card className="py-12 text-center text-xs text-slate-400">
            No check-in entries found for the selected date range.
          </Card>
        ) : (
          checkins.map((entry) => {
            const isHighStress = entry.stress_level >= 4
            return (
              <Card
                key={entry.id}
                className={`p-5 transition hover:border-slate-700 ${
                  isHighStress ? 'border-rose-500/20 bg-rose-950/5' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">
                      {moodEmojis[entry.mood] || '😐'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{entry.date}</span>
                        <Badge variant={entry.stress_level >= 4 ? 'error' : entry.stress_level >= 3 ? 'warning' : 'success'}>
                          Stress {entry.stress_level} / 5
                        </Badge>
                        {isHighStress && (
                          <span className="text-[10px] bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded-full font-medium border border-rose-500/30">
                            Elevated Stress
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="capitalize">Mood: {entry.mood.replace('_', ' ')}</span>
                        {entry.sleep_quality && (
                          <span>• Sleep: {entry.sleep_quality === 3 ? 'Good 😊' : entry.sleep_quality === 2 ? 'Okay 😐' : 'Poor 😴'}</span>
                        )}
                        {entry.academic_pressure && (
                          <span>• Exam Pressure: {entry.academic_pressure}/5</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Private reflection note */}
                {entry.private_note && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="italic leading-relaxed">"{entry.private_note}"</p>
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
