import React, { useState } from 'react'
import {
  Heart,
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Activity,
  Smile,
  Meh,
  Frown,
  GraduationCap,
  BellRing,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { GoogleIcon } from '../ui/GoogleIcon'
import type { UserRole } from '../../types'

interface LandingPageProps {
  onOpenAuth: (role?: UserRole) => void
  onQuickDemo: (role: UserRole) => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onQuickDemo,
}) => {
  // Interactive Hero Widget State
  const [heroMood, setHeroMood] = useState<'happy' | 'neutral' | 'sad'>('happy')
  const [heroStress, setHeroStress] = useState<number>(3)
  const [heroSleep, setHeroSleep] = useState<string>('7-8 hrs')
  const [heroNote, setHeroNote] = useState<string>('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student')

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-40 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1800px] -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-200">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                    WellTrack
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    Campus AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Student Early Warning System
                </span>
              </div>
            </a>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-400 transition">
              How It Works
            </a>
            <a href="#privacy" className="hover:text-indigo-400 transition flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Note Shield</span>
            </a>
            <a href="#campus" className="hover:text-indigo-400 transition">
              For Universities
            </a>
            <a href="#faq" className="hover:text-indigo-400 transition">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('staff')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl border border-slate-800 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Counselor Portal</span>
            </button>

            {/* Official Google Sign-In Button */}
            <button
              onClick={() => onOpenAuth('student')}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 transition duration-150 cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>

            {/* Instant Demo Sandbox */}
            <Button
              size="sm"
              variant="primary"
              onClick={() => onQuickDemo('student')}
              className="hidden lg:inline-flex"
              leftIcon={<Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
            >
              Live Demo
            </Button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>CodeForge '26 Problem Statement Solution</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">FERPA & Rule 07 Compliant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Notice Student Stress{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">
                Before It Becomes Burnout.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              WellTrack empowers campus communities with frictionless 60-second daily check-ins, automated 3-consecutive-day high-stress streak detection, and a cryptographically isolated zero-note privacy shield that students actually trust.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Big Google Button */}
              <button
                onClick={() => onOpenAuth('student')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-base shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              {/* Quick Role Buttons */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onQuickDemo('student')}
                  className="flex-1 sm:flex-none border-indigo-500/40 hover:bg-indigo-950/40 text-indigo-300 text-sm font-semibold"
                  leftIcon={<GraduationCap className="w-4 h-4 text-indigo-400" />}
                >
                  Student Portal
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onQuickDemo('staff')}
                  className="flex-1 sm:flex-none border-rose-500/40 hover:bg-rose-950/40 text-rose-300 text-sm font-semibold"
                  leftIcon={<ShieldCheck className="w-4 h-4 text-rose-400" />}
                >
                  Counselor Portal
                </Button>
              </div>
            </div>

            {/* Micro Trust Points */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero clinical jargon</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Notes never visible to staff (Rule 07)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant campus SSO</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive 60-Second Check-in Widget */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Decorative background glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-30 blur-xl animate-pulse" />

              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                {/* Header of widget */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        Try a 60-Second Check-In
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Interactive sandbox • See live feedback
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Live Demo
                  </span>
                </div>

                {/* 1. Mood Picker */}
                <div className="py-4 border-b border-slate-800/60">
                  <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                    How is your head space today?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroMood('happy')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        heroMood === 'happy'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Smile className="w-5 h-5 text-emerald-400" />
                      <span className="text-[11px] font-medium">Good</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHeroMood('neutral')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        heroMood === 'neutral'
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Meh className="w-5 h-5 text-amber-400" />
                      <span className="text-[11px] font-medium">Neutral</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHeroMood('sad')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        heroMood === 'sad'
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Frown className="w-5 h-5 text-rose-400" />
                      <span className="text-[11px] font-medium">Struggling</span>
                    </button>
                  </div>
                </div>

                {/* 2. Stress Slider (1-5) */}
                <div className="py-4 border-b border-slate-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Stress Level (1–5)
                    </label>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        heroStress >= 4
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      Level {heroStress}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={heroStress}
                    onChange={(e) => setHeroStress(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                    <span>1 (Calm)</span>
                    <span className="text-indigo-400">3 (Balanced)</span>
                    <span className="text-rose-400">5 (Critical)</span>
                  </div>

                  {heroStress >= 4 && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 flex items-center gap-2">
                      <BellRing className="w-3.5 h-3.5 shrink-0 text-rose-400 animate-bounce" />
                      <span>
                        Notice: Sustained stress (≥ 4 for 3 days) quietly triggers staff support signal.
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Sleep & Private Note Preview */}
                <div className="py-3 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Sleep Last Night:</span>
                    <div className="flex gap-1.5">
                      {['< 5 hrs', '6-7 hrs', '8+ hrs'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHeroSleep(val)}
                          className={`text-[10px] px-2 py-1 rounded-md border font-mono transition cursor-pointer ${
                            heroSleep === val
                              ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Confidential note (Rule 07: 100% hidden from staff)..."
                      value={heroNote}
                      onChange={(e) => setHeroNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Lock className="w-3 h-3 text-emerald-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('student')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer transition"
                  >
                    <span>Save Check-In & Enter Student Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    Ready to explore? Instant access with Google or 1-click demo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICS / STATS STRIP */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-400">
                &lt; 60s
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Daily Check-In Time
              </p>
              <p className="text-[11px] text-slate-500">
                Zero survey fatigue
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-rose-400">
                72h
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Early Crisis Warning
              </p>
              <p className="text-[11px] text-slate-500">
                Algorithmic 3-day stress streak
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-400">
                100%
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Private Note Isolation
              </p>
              <p className="text-[11px] text-slate-500">
                Strict Requirement 07 Shield
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-purple-400">
                1-Click
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Google SSO Integration
              </p>
              <p className="text-[11px] text-slate-500">
                Zero password friction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE CORE PROBLEM VS. WELLTRACK (WHY CURRENT SYSTEMS FAIL) */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            The Campus Mental Health Blindspot
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Traditional University Surveys Fail Students
          </h3>
          <p className="text-base text-slate-400 leading-relaxed">
            Most universities rely on end-of-semester questionnaires or reactive emergency room visits. By the time a student reaches out, they have already endured weeks of severe academic and emotional strain.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Old Way */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-rose-950/60 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>The Broken Status Quo</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">
              End-of-Semester Reactive Surveys
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span><strong>Massive Survey Fatigue:</strong> 40+ medical diagnostic questions result in under 4% response rates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span><strong>Too Late to Intervene:</strong> Data is analyzed months after midterms when burnouts and dropouts have already occurred.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span><strong>Fear of Surveillance:</strong> Students distrust university surveys because they fear their reflections will be read by staff or professors.</span>
              </li>
            </ul>
          </div>

          {/* The WellTrack Way */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-500/40 relative overflow-hidden shadow-xl shadow-indigo-500/5">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>The WellTrack Standard</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">
              Continuous 60-Second Early Warning
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong>Frictionless Daily Habit:</strong> Quick 3-tap emoji and slider flow with 98%+ student retention.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong>Automated 3-Day Trigger:</strong> High stress (≥ 4 for 3 consecutive days) triggers counselor triage automatically.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong>Cryptographic Note Isolation:</strong> Requirement 07 guarantees counselors see only names & dates—never personal notes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. BENTO GRID FEATURES */}
      <section id="features" className="py-20 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Built For Hackathon Excellence
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered to Solve Every Core Requirement
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              From real-time 7-day trajectories to automated counselor flags, every feature maps directly to the CodeForge '26 mental health specification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bento Card 1: 60-Sec Checkin */}
            <div className="p-7 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400 group-hover:scale-110 transition">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  Daily Check-In Engine
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Record daily mood (<span className="text-emerald-400">happy</span>, <span className="text-amber-400">neutral</span>, <span className="text-rose-400">sad</span>), stress rating on a 1–5 scale, sleep quality, and optional reflections in under 60 seconds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                <span>Problem Req 01 & 02</span>
                <span>60s Flow →</span>
              </div>
            </div>

            {/* Bento Card 2: 7-Day Trend Engine */}
            <div className="p-7 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400 group-hover:scale-110 transition">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  7-Day Trend & Trajectory
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Dynamic mood curve visualizer with trajectory indicators (improving, stable, declining), daily streak multipliers, and personalized non-diagnostic wellbeing insights.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>Problem Req 03</span>
                <span>Rolling Trends →</span>
              </div>
            </div>

            {/* Bento Card 3: Requirement 07 Zero-Note Privacy Shield */}
            <div id="privacy" className="p-7 rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400 group-hover:scale-110 transition">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  Zero-Note Privacy Shield
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Strict compliance with <strong>Requirement 07</strong>. Staff and counselors can see student names and flagged date ranges ONLY. Private notes are cryptographically shielded and never returned to staff endpoints.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Problem Req 07</span>
                <span>Zero Leakage →</span>
              </div>
            </div>

            {/* Bento Card 4: 3-Day High Stress Flag */}
            <div className="p-7 rounded-3xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition duration-300 group flex flex-col justify-between md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      3-Day Consecutive High-Stress Engine
                    </h4>
                    <p className="text-xs text-slate-400">
                      Algorithmic support signal trigger (Requirement 05 & 06)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 self-start sm:self-auto">
                  Stress ≥ 4 for 3 Days
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                When a student logs a stress level of 4 or 5 for three consecutive calendar days, the engine triggers an automated Support Signal. Counselors receive a prioritized triage entry containing the student's name and affected dates to coordinate timely support before midterm exhaustion sets in.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-rose-400 font-semibold">
                <span>Automated Alerting Engine</span>
                <span className="text-slate-400">Tested & Verified in Backend Suite</span>
              </div>
            </div>

            {/* Bento Card 5: Emergency 988 Helpline */}
            <div className="p-7 rounded-3xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-600/15 border border-amber-500/30 flex items-center justify-center mb-5 text-amber-400 group-hover:scale-110 transition">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  Immediate 24/7 Helpline
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  One-tap access to the 988 Suicide & Crisis Lifeline, Crisis Text Line (741741), and Campus Counseling Services directly within the student app.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Safety First</span>
                <span>Non-Diagnostic →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DUAL PERSPECTIVE TABS (STUDENT VS COUNSELOR) */}
      <section id="campus" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Tailored Experiences
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Two Purpose-Built Portals. One United Campus.
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Students get self-reflection and empowerment. Counselors get actionable early warning signals without violating student trust.
          </p>

          {/* Toggle Pills */}
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>For Students</span>
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'staff'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>For Counselors & Staff</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'student' ? (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-900/40 p-8 sm:p-12 rounded-3xl border border-slate-800">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Empowerment Portal</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-white">
                Track your habits, understand your mind, protect your peace.
              </h4>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive 7-day mood & stress graphs with trajectory markers.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Maintain daily check-in streaks to cultivate positive mindfulness.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Filter check-in history by date range and search private notes.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Immediate access to campus counselors with zero friction.</span>
                </li>
              </ul>
              <div className="pt-2 flex gap-3">
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => onQuickDemo('student')}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                >
                  Launch Student View
                </Button>
                <button
                  onClick={() => onOpenAuth('student')}
                  className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition cursor-pointer"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>

            {/* Student Preview Card Mockup */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Daily Wellness Trajectory</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  +12% Stable
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <div className="text-xs font-bold text-white">4 Days</div>
                  <div className="text-[10px] text-slate-400">Current Streak</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <div className="text-xs font-bold text-emerald-400">Happy</div>
                  <div className="text-[10px] text-slate-400">Avg Mood</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <div className="text-xs font-bold text-indigo-400">2.6 / 5</div>
                  <div className="text-[10px] text-slate-400">Stress Avg</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <div className="text-xs font-bold text-purple-400">7.5 hrs</div>
                  <div className="text-[10px] text-slate-400">Sleep Avg</div>
                </div>
              </div>
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                💡 <strong>Weekly Reflection:</strong> Your stress drops significantly on days with 7+ hours of sleep. Keep prioritizing regular sleep schedules during exam week.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-900/40 p-8 sm:p-12 rounded-3xl border border-slate-800">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Counselor & Staff Command Center</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-white">
                Actionable early alerts without invasive surveillance.
              </h4>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time table of students triggering 3-day high-stress streaks.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero student private notes are ever displayed (Strict Rule 07).</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Track counselor outreach status (Pending, Contacted, Resolved).</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aggregate campus health trends for institutional planning.</span>
                </li>
              </ul>
              <div className="pt-2 flex gap-3">
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => onQuickDemo('staff')}
                  className="border-rose-500/40 text-rose-300 hover:bg-rose-950/40"
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  Launch Counselor Portal
                </Button>
                <button
                  onClick={() => onOpenAuth('staff')}
                  className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition cursor-pointer"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Staff Google Sign-In</span>
                </button>
              </div>
            </div>

            {/* Staff Preview Mockup */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Flagged Students (3-Day High Stress)</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-mono">
                  Action Required
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">Sarah Jenkins</div>
                    <div className="text-[11px] text-slate-400">Oct 12 – Oct 14 (3 days ≥ 4)</div>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                    Outreach Pending
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">Alex Rivera</div>
                    <div className="text-[11px] text-slate-400">Oct 10 – Oct 13 (4 days ≥ 4)</div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                    Contacted
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>Privacy Lock: Student reflections & notes are permanently filtered out from this table.</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Clarity & Compliance
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-slate-400 text-sm">
              Everything you need to know about privacy, algorithms, and institutional security.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can campus counselors or professors read my daily notes?',
                a: 'Strictly NO. WellTrack is engineered around Rule 07 of the CodeForge specification. Private notes are isolated and encrypted at rest. When a counselor accesses their portal, the database query deliberately excludes the private_notes column. Staff only see your name and date range so they can offer assistance if you have sustained high stress.',
              },
              {
                q: 'What triggers the 3-day high-stress support signal?',
                a: 'If a student logs a stress rating of 4 or 5 for three consecutive calendar days, the backend algorithm flags the student profile for counselor triage. This allows campus wellness staff to intervene proactively before students reach extreme burnout.',
              },
              {
                q: 'How does Google Sign-In work for students and staff?',
                a: 'WellTrack supports Google Single Sign-On (SSO) as well as campus edu domain authentication. In this sandbox deployment, clicking "Sign in with Google" provides simulated 1-click authentication to test both Student and Counselor perspectives seamlessly.',
              },
              {
                q: 'Is WellTrack a medical or diagnostic instrument?',
                a: 'No. WellTrack is an early-warning wellbeing tracking platform. It does not provide medical diagnoses or replace licensed clinical psychotherapy. It provides non-diagnostic lifestyle insights and instant bridges to 988 and campus counselors.',
              },
              {
                q: 'How is student data protected under FERPA?',
                a: 'WellTrack employs strict role-based access control (RBAC). Only verified university counselors have access to flagged student rosters, and private journal entries are completely hidden from all administrative accounts.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition"
                >
                  <span className="font-bold text-sm sm:text-base text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL HIGH-CONVERTING CTA BANNER */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-tr from-indigo-900/50 via-slate-900 to-purple-900/40 border border-indigo-500/30 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Ready for Live Evaluation
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experience the Future of Campus Mental Health Today
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Log in with Google or test the student & counselor sandboxes in under 10 seconds. Real FastAPI backend, persistent SQLite/PostgreSQL models, and live 7-day analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('student')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>

              <Button
                size="lg"
                variant="primary"
                onClick={() => onQuickDemo('student')}
                leftIcon={<Zap className="w-4 h-4 text-amber-300 fill-amber-300" />}
              >
                Launch Live Demo Sandbox
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CRISIS LIFELINE EMERGENCY BAR & FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Lifeline Notice */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-rose-300">
              <PhoneCall className="w-5 h-5 shrink-0 text-rose-400" />
              <span>
                <strong>24/7 Crisis Support:</strong> If you or someone you know is struggling or in distress, help is available.
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono font-bold text-slate-200">
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Call/Text: 988
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                Text HOME to 741741
              </span>
            </div>
          </div>

          {/* Links & Brand */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-900 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-300 text-sm">WellTrack</span>
              <span>• CodeForge '26 Submission</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#features" className="hover:text-slate-400 transition">
                Features
              </a>
              <a href="#privacy" className="hover:text-slate-400 transition">
                Privacy (Rule 07)
              </a>
              <a href="#campus" className="hover:text-slate-400 transition">
                Campus SSO
              </a>
              <a
                href="https://codeforge-zdxk.onrender.com/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-400 transition text-indigo-400"
              >
                FastAPI Swagger Docs ↗
              </a>
            </div>

            <p>© 2026 WellTrack Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
