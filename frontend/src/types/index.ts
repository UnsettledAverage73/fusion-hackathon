export type NavSection = 'dashboard' | 'playground' | 'records' | 'settings'

export interface StatItem {
  id: string
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  iconName?: string
}

export interface ActivityRecord {
  id: string
  title: string
  category: string
  status: 'completed' | 'in_progress' | 'pending' | 'failed'
  createdAt: string
  author: string
}

export interface User {
  id: number
  email: string
  full_name?: string
  picture?: string
  role: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface GoogleConfig {
  client_id: string
  auth_uri: string
  redirect_uri: string
}

export interface SlackAlertPayload {
  title: string
  message: string
  severity?: 'INFO' | 'WARNING' | 'CRITICAL'
  details?: Record<string, string | number>
}

export interface OrchestrationResult {
  prompt: string
  route_selected: string
  provider: string
  probabilities: Record<string, number>
  semif_model: string
  response: string
  latency_ms: number
}
