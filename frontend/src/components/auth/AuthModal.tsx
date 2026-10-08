import React, { useEffect, useRef, useState } from 'react'
import { Sparkles, Shield, User as UserIcon, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { demoLogin, getGoogleConfig, verifyGoogleToken } from '../../api/client'
import type { User } from '../../types'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: User) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (parent: HTMLElement, options: any) => void
          prompt: () => void
        }
      }
    }
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleClientId, setGoogleClientId] = useState<string>('')
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (envClientId) {
      setGoogleClientId(envClientId)
    }

    getGoogleConfig()
      .then((cfg) => {
        if (cfg.client_id) {
          setGoogleClientId(cfg.client_id)
        }
      })
      .catch(() => {
        // Fallback: demo login works even without configured Google Client ID
      })
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !googleClientId || !googleBtnRef.current) return

    // Dynamically inject Google Identity Services script if not already present
    const scriptId = 'google-gsi-client'
    const initGsi = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: { credential: string }) => {
            try {
              setLoading(true)
              setError(null)
              const authRes = await verifyGoogleToken(response.credential)
              onSuccess(authRes.user)
              onClose()
            } catch (err: any) {
              setError(err.response?.data?.detail || 'Google authentication failed.')
            } finally {
              setLoading(false)
            }
          },
        })

        googleBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          shape: 'pill',
        })
      }
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initGsi
      document.body.appendChild(script)
    } else {
      initGsi()
    }
  }, [isOpen, googleClientId, onClose, onSuccess])

  const handleDemoLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await demoLogin()
      onSuccess(res.user)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to authenticate demo user.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign in to Fusion Hackathon
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access secure team workspaces, live notifications, and AI playground.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Render Google Button container if client ID is configured */}
          {googleClientId ? (
            <div className="flex flex-col items-center gap-2">
              <div ref={googleBtnRef} className="min-h-[40px] flex items-center justify-center" />
              <div className="relative w-full text-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-medium">
                  or evaluation
                </span>
              </div>
            </div>
          ) : null}

          {/* 1-Click Demo Login for Judges and Pitching */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-4">
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Instant Pitching Mode</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Skip typing or OAuth configuration. Instantly login with an authenticated Evaluator profile.
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              disabled={loading}
              onClick={handleDemoLogin}
              leftIcon={<UserIcon className="w-4 h-4" />}
            >
              {loading ? 'Authenticating...' : '1-Click Judge & Tester Sign In'}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secured via HS256 JWT & Google Identity Services</span>
          </div>
        </div>
      </div>
    </div>
  )
}
