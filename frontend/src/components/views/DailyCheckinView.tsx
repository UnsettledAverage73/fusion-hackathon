import { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  Heart,
  Lock,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Smile,
  Moon,
  BookOpen,
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { submitDailyCheckin } from '../../api/client'
import type { NavSection } from '../../types'

interface DailyCheckinViewProps {
  onCheckinSuccess: () => void
  onNavigate: (section: NavSection) => void
}

export const DailyCheckinView: React.FC<DailyCheckinViewProps> = ({
  onCheckinSuccess,
  onNavigate,
}) => {
  const today = new Date().toISOString().slice(0, 10)

  const [date, setDate] = useState(today)
  const [mood, setMood] = useState<'great' | 'happy' | 'neutral' | 'sad' | 'very_low'>('neutral')
  const [stressLevel, setStressLevel] = useState<number>(3)
  const [sleepQuality, setSleepQuality] = useState<number>(2)
  const [academicPressure, setAcademicPressure] = useState<number>(3)
  const [privateNote, setPrivateNote] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const moodOptions = [
    { id: 'great', label: 'Great', emoji: '😄', desc: 'Energized & positive' },
    { id: 'happy', label: 'Happy', emoji: '🙂', desc: 'Good, content' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', desc: 'Normal, average' },
    { id: 'sad', label: 'Low', emoji: '😔', desc: 'Feeling down/tired' },
    { id: 'very_low', label: 'Very Low', emoji: '😣', desc: 'Struggling, exhausted' },
  ]

  const stressLevels = [
    { level: 1, label: '1 - Very Low', desc: 'Completely relaxed', color: 'border-emerald-500/40 hover:border-emerald-500' },
    { level: 2, label: '2 - Mild', desc: 'Easy to manage', color: 'border-teal-500/40 hover:border-teal-500' },
    { level: 3, label: '3 - Moderate', desc: 'Noticeable pressure', color: 'border-indigo-500/40 hover:border-indigo-500' },
    { level: 4, label: '4 - High', desc: 'Anxious / Strained (Flag alert)', color: 'border-amber-500/50 hover:border-amber-500' },
    { level: 5, label: '5 - Severe', desc: 'Overwhelmed / Peak stress', color: 'border-rose-500/60 hover:border-rose-500' },
  ]

  const sleepOptions = [
    { level: 1, label: 'Poor', emoji: '😴', desc: '< 5 hrs / Broken sleep' },
    { level: 2, label: 'Okay', emoji: '😐', desc: '6–7 hrs / Fair rest' },
    { level: 3, label: 'Good', emoji: '😊', desc: '8+ hrs / Well rested' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      await submitDailyCheckin({
        date,
        mood,
        stress_level: stressLevel,
        sleep_quality: sleepQuality,
        academic_pressure: academicPressure,
        private_note: privateNote.trim() || undefined,
      })

      // Celebration
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.7 },
        })
      } catch {
        // ignore
      }

      setSubmitted(true)
      setTimeout(() => {
        onCheckinSuccess()
      }, 1800)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to submit check-in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Daily Check-in Recorded!</h2>
        <p className="text-sm text-slate-300">
          Your mood and stress levels have been securely logged. Your 7-day trend graphs and personal insights have been updated.
        </p>
        <div className="pt-4">
          <Button variant="primary" onClick={() => onNavigate('dashboard')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Daily Mood & Stress Check-in</h2>
        <p className="text-xs text-slate-400 mt-1">
          Take 60 seconds to reflect on your day. Your logs help identify patterns before burnout occurs.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Check-in Date</span>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </Card>

        {/* 1. Mood Selection */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Smile className="w-4 h-4 text-indigo-400" />
              <span>1. How are you feeling today?</span>
            </label>
            <span className="text-xs text-slate-400">Select one</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            {moodOptions.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setMood(opt.id as any)}
                className={`p-3.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  mood === opt.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] text-slate-500 leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* 2. Stress Level (1 to 5) */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>2. Current Stress Level (1 to 5)</span>
            </label>
            <span className={`text-xs font-bold ${stressLevel >= 4 ? 'text-rose-400' : 'text-indigo-400'}`}>
              Level {stressLevel} of 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
            {stressLevels.map((lvl) => (
              <button
                type="button"
                key={lvl.level}
                onClick={() => setStressLevel(lvl.level)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  stressLevel === lvl.level
                    ? lvl.level >= 4
                      ? 'bg-rose-950/30 border-rose-500 text-white shadow-md'
                      : 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : `bg-slate-950/60 ${lvl.color} text-slate-400 hover:text-slate-200`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{lvl.level}</span>
                  {lvl.level >= 4 && (
                    <span className="text-[9px] font-semibold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                      Elevated
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-medium text-slate-300 mt-1">{lvl.desc}</div>
              </button>
            ))}
          </div>

          {stressLevel >= 4 && (
            <p className="text-[11px] text-amber-300 bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-lg">
              ⚠️ Reporting stress at 4 or 5 for 3 consecutive days will generate a proactive campus counselor support signal so you don't face it alone.
            </p>
          )}
        </Card>

        {/* 3. Sleep Quality & Academic Pressure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 space-y-2.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>3. How was your sleep?</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sleepOptions.map((s) => (
                <button
                  type="button"
                  key={s.level}
                  onClick={() => setSleepQuality(s.level)}
                  className={`py-2 px-2 rounded-lg border text-center text-xs transition cursor-pointer ${
                    sleepQuality === s.level
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>{s.emoji}</div>
                  <div className="font-semibold text-[11px] mt-0.5">{s.label}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>4. Academic / Exam Pressure</span>
              </label>
              <span className="text-xs font-mono text-indigo-400">{academicPressure} / 5</span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={academicPressure}
                onChange={(e) => setAcademicPressure(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Light</span>
                <span>Average</span>
                <span>Heavy Exams</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 4. Optional Private Note (Strict Privacy Callout) */}
        <Card className="p-5 space-y-2.5 border-indigo-500/20">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>5. Optional Daily Reflection (Private Note)</span>
            </label>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              🔒 100% Confidential
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Write down what is on your mind. Per Problem Requirement 07, college counselors and staff
            are strictly prohibited from viewing your private reflections.
          </p>

          <textarea
            rows={3}
            value={privateNote}
            onChange={(e) => setPrivateNote(e.target.value)}
            placeholder="e.g., Struggled with algorithm homework, but felt better after talking to my roommate..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => onNavigate('dashboard')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            Save Daily Check-in
          </Button>
        </div>
      </form>
    </div>
  )
}
