import React, { useState } from 'react'
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Cpu,
  Zap,
  Globe,
  Layers,
  RefreshCw,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { runOrchestration } from '../../api/client'
import type { OrchestrationResult } from '../../types'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  orchestration?: OrchestrationResult
}

export const PlaygroundView: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<OrchestrationResult | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Welcome to the SemIf + Groq + Sarvam Multi-Model Orchestration Engine!\n\n• System 1 (SemIf): Direct-logit scoring evaluates intent and options without autoregressive token generation.\n• System 2 (Groq): Dispatches complex reasoning and code synthesis via Llama-3.3-70B.\n• System 2 (Sarvam): Localizes Indic vernacular queries (Hindi, Marathi, Tamil, etc.).\n\nEnter a technical query, code problem, or an Indic vernacular sentence below.",
      timestamp: 'Ready',
    },
  ])

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return

    const userText = prompt
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setPrompt('')
    setIsLoading(true)

    try {
      const result = await runOrchestration(userText)
      setLastResult(result)

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        orchestration: result,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err: any) {
      const errMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Error connecting to orchestration pipeline: ${err.message || 'Network error'}`,
        timestamp: 'Error',
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const loadSample = (sampleText: string) => {
    setPrompt(sampleText)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8.5rem)]">
      {/* Main Conversation / Playground area */}
      <div className="lg:col-span-3 flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                SemIf &bull; Groq &bull; Sarvam Pipeline
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct-Logit Classification &rarr; Fast / Indic / Deep Execution
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">SemIf System-1 Active</Badge>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'
            const orch = msg.orchestration

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-indigo-400 border border-slate-700'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-sm relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {/* SemIf Telemetry Ribbon */}
                  {orch && (
                    <div className="mb-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                          SemIf Direct-Logit Gate
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {orch.latency_ms} ms
                        </span>
                      </div>

                      {/* Probabilities Meter */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {Object.entries(orch.probabilities).map(([opt, prob]) => {
                          const isSelected = opt === orch.route_selected
                          return (
                            <div
                              key={opt}
                              className={`p-1.5 rounded-lg border text-center ${
                                isSelected
                                  ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200'
                                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="text-[10px] truncate font-medium">{opt}</div>
                              <div className="font-mono text-xs font-bold">
                                {(prob * 100).toFixed(1)}%
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <span>Provider Executed:</span>
                        <span className="text-slate-200 font-semibold">{orch.provider}</span>
                      </div>
                    </div>
                  )}

                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:opacity-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="flex gap-3 max-w-md">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="rounded-2xl p-3 bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-400">
                  Scoring SemIf direct logits & orchestrating...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask for system architecture, debug code, or type in Hindi/Marathi..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <Button
              type="submit"
              size="md"
              disabled={!prompt.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Orchestrate
            </Button>
          </form>
        </div>
      </div>

      {/* Side Panel: SemIf Architecture & Sample Triggers */}
      <div className="space-y-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <CardTitle>SemIf Architecture</CardTitle>
            </div>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                System-1: Direct Logit
              </span>
              <p className="text-[11px] text-slate-400">
                SemIf reads candidate logits without generation. Zero sampling delay, 0 token waste.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                System-2: Groq (Llama-3.3)
              </span>
              <p className="text-[11px] text-slate-400">
                Triggered for deep synthesis, algorithm refactoring, and complex technical logic.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-pink-400" />
                System-2: Sarvam (Indic)
              </span>
              <p className="text-[11px] text-slate-400">
                Triggered for vernacular Indic languages with regional translation & speech.
              </p>
            </div>
          </div>
        </Card>

        {/* Live Pitch Test Prompts */}
        <Card className="bg-indigo-950/20 border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>1-Click Test Prompts</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() =>
                loadSample(
                  "Design a high-throughput microservice architecture in Python with SQLite and JWT."
                )
              }
              className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition"
            >
              🚀 <span className="font-medium text-slate-100">Groq Path:</span> Complex System Architecture
            </button>

            <button
              onClick={() =>
                loadSample(
                  "नमस्ते, या सिस्टीमचा वापर कसा करायचा आणि डेटा सुरक्षित कसा ठेवायचा?"
                )
              }
              className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition"
            >
              🇮🇳 <span className="font-medium text-slate-100">Sarvam Path:</span> Marathi/Hindi Vernacular
            </button>

            <button
              onClick={() => loadSample("health status check")}
              className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition"
            >
              ⚡ <span className="font-medium text-slate-100">Fast Path:</span> Direct Status Ping
            </button>
          </div>
        </Card>

        {/* Real-time Telemetry Stats */}
        {lastResult && (
          <Card>
            <div className="text-xs space-y-2">
              <span className="font-semibold text-slate-200 block border-b border-slate-800 pb-1.5">
                Latest Pipeline Telemetry
              </span>
              <div className="flex justify-between text-slate-400">
                <span>Model Engine:</span>
                <span className="font-mono text-slate-200">{lastResult.semif_model}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Selected Route:</span>
                <span className="font-mono text-indigo-400 font-semibold">{lastResult.route_selected}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>E2E Latency:</span>
                <span className="font-mono text-emerald-400 font-semibold">{lastResult.latency_ms} ms</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
