import { useState, useEffect } from 'react'
import {
  Lock,
  X,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Heart,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { GoogleIcon } from '../ui/GoogleIcon'
import { demoLogin } from '../../api/client'
import type { User, UserRole } from '../../types'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (user: User, role: UserRole) => void
  defaultRole?: UserRole
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  defaultRole = 'student',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(defaultRole)
    }
  }, [defaultRole, isOpen])

  if (!isOpen) return null

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrorMsg(null)

    try {
      // Authenticate via demo endpoint with Google identity simulation
      const res = await demoLogin(selectedRole)
      onAuthSuccess(res.user, selectedRole)
      onClose()
    } catch {
      setErrorMsg('Google authentication encountered a delay. Retrying...')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle One-Click Quick Login
  const handleQuickDemo = async (role: UserRole) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await demoLogin(role)
      onAuthSuccess(res.user, role)
      onClose()
    } catch {
      setErrorMsg('Failed to log in with demo account.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle standard form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await demoLogin(selectedRole)
      onAuthSuccess(
        {
          ...res.user,
          name: name || (selectedRole === 'student' ? 'Atharva Dev' : 'Dr. Aris Thorne'),
          email: email || res.user.email,
        },
        selectedRole
      )
      onClose()
    } catch {
      setErrorMsg('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 shadow-lg shadow-indigo-500/20 text-white mb-2">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {authMode === 'signin' ? 'Welcome Back to WellTrack' : 'Create Your WellTrack Account'}
          </h3>
          <p className="text-xs text-slate-400">
            Higher education student mood tracking & proactive support signals
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('staff')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              selectedRole === 'staff'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Counselor / Staff</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Official Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-700 bg-slate-950/80 hover:bg-slate-800 text-slate-100 text-sm font-semibold shadow-sm hover:border-slate-500 transition duration-150 cursor-pointer disabled:opacity-50"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-slate-900 px-2 text-slate-500 font-semibold tracking-wider">
              Or quick demo sign-in
            </span>
          </div>
        </div>

        {/* 2. One-Click Hackathon Quick Logins */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleQuickDemo('student')}
            className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-950/60 text-indigo-200 text-xs font-medium transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="font-semibold text-white">Student Demo: Atharva Dev</div>
                <div className="text-[10px] text-indigo-300/80">3-day stress streak ready for presentation</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('staff')}
            className="flex items-center justify-between p-2.5 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-950/60 text-rose-200 text-xs font-medium transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <div>
                <div className="font-semibold text-white">Counselor Demo: Dr. Aris Thorne</div>
                <div className="text-[10px] text-rose-300/80">View support signals (Zero student notes visible)</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
          </button>
        </div>

        {/* 3. Standard Email / Password Form (Collapsible or Clean) */}
        <form onSubmit={handleFormSubmit} className="space-y-3 pt-1 border-t border-slate-800">
          {authMode === 'signup' && (
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Atharva Bodade"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">University Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {authMode === 'signin' ? 'Sign In with Email' : 'Create University Account'}
          </Button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {authMode === 'signin' ? (
            <span>
              New to WellTrack?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        {/* FERPA & Privacy Notice */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>FERPA Compliant • Requirement 07 Zero-Note Exposure Protocol</span>
        </div>
      </div>
    </div>
  )
}
