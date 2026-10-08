import axios from 'axios'
import type { ActivityRecord, AuthResponse, GoogleConfig, OrchestrationResult, SlackAlertPayload, StatItem, User } from '../types'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://codeforge-zdxk.onrender.com'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach Bearer token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fusion_auth_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface BackendItem {
  id: number
  title: string
  description?: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

// Live Backend API Methods
export async function getHealthStatus(): Promise<{ status: string }> {
  const res = await api.get<{ status: string }>('/health')
  return res.data
}

export async function getItems(): Promise<BackendItem[]> {
  const res = await api.get<BackendItem[]>('/api/v1/items')
  return res.data
}

export async function createItem(payload: {
  title: string
  description?: string
  is_completed?: boolean
}): Promise<BackendItem> {
  const res = await api.post<BackendItem>('/api/v1/items', payload)
  return res.data
}

export async function deleteItem(itemId: number): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/api/v1/items/${itemId}`)
  return res.data
}

// Authentication API
export async function getGoogleConfig(): Promise<GoogleConfig> {
  const res = await api.get<GoogleConfig>('/api/v1/auth/google/config')
  return res.data
}

export async function verifyGoogleToken(credential: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/v1/auth/google/verify', { credential })
  if (res.data.access_token) {
    localStorage.setItem('fusion_auth_token', res.data.access_token)
    localStorage.setItem('fusion_user', JSON.stringify(res.data.user))
  }
  return res.data
}

export async function demoLogin(): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/v1/auth/demo')
  if (res.data.access_token) {
    localStorage.setItem('fusion_auth_token', res.data.access_token)
    localStorage.setItem('fusion_user', JSON.stringify(res.data.user))
  }
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/api/v1/auth/me')
  return res.data
}

export function logoutUser(): void {
  localStorage.removeItem('fusion_auth_token')
  localStorage.removeItem('fusion_user')
}

export function getSavedUser(): User | null {
  const userStr = localStorage.getItem('fusion_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

// Slack Notification API
export async function sendSlackAlert(payload: SlackAlertPayload): Promise<{ delivered: boolean; message: string }> {
  const res = await api.post<{ delivered: boolean; message: string }>('/api/v1/notifications/slack', payload)
  return res.data
}

// SemIf + Groq + Sarvam Model Orchestration API
export async function runOrchestration(prompt: string, context?: string): Promise<OrchestrationResult> {
  const res = await api.post<OrchestrationResult>('/api/v1/ai/run', { prompt, context })
  return res.data
}

// Mock fallback dataset for instant hackathon pitching
export const mockStats: StatItem[] = [
  { id: '1', label: 'Active Projects', value: '12', change: '+24%', trend: 'up' },
  { id: '2', label: 'Tasks Processed', value: '1,429', change: '+18%', trend: 'up' },
  { id: '3', label: 'Render Latency', value: '84ms', change: '-12ms', trend: 'up' },
  { id: '4', label: 'Accuracy Score', value: '99.4%', change: '+0.6%', trend: 'up' },
]

export const mockRecords: ActivityRecord[] = [
  {
    id: 'rec-1',
    title: 'Model Pipeline Inference',
    category: 'AI / ML',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    author: 'Alex Dev',
  },
  {
    id: 'rec-2',
    title: 'Data Ingestion Batch #84',
    category: 'Database',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    author: 'System Worker',
  },
  {
    id: 'rec-3',
    title: 'Semantic Vector Re-indexing',
    category: 'Search Engine',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    author: 'Sam Architect',
  },
  {
    id: 'rec-4',
    title: 'OAuth Provider Sync Check',
    category: 'Auth & Security',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    author: 'DevOps Bot',
  },
]
