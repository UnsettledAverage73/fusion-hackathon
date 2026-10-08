import axios from 'axios'
import type {
  CheckIn,
  DashboardSummary,
  DashboardTrends,
  StaffSignalItem,
  User,
  UserRole,
} from '../types'

export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'https://codeforge-zdxk.onrender.com')

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

// Attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeforge_auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function setStoredToken(token: string) {
  localStorage.setItem('codeforge_auth_token', token)
}

export function getStoredToken(): string | null {
  return localStorage.getItem('codeforge_auth_token')
}

export function clearStoredToken() {
  localStorage.removeItem('codeforge_auth_token')
}

// 1. Health check
export async function getHealthStatus(retries = 2): Promise<{ status: string }> {
  const url = `${API_BASE_URL}/health`
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, 1500))
    }
  }
  return { status: 'error' }
}

// 2. Auth & Demo Login
export async function demoLogin(role: UserRole = 'student'): Promise<{ token: string; user: User }> {
  try {
    const res = await api.post('/api/v1/auth/demo-login', { role })
    setStoredToken(res.data.access_token)
    return { token: res.data.access_token, user: res.data.user }
  } catch {
    // Graceful offline fallback
    const mockUser: User = role === 'staff'
      ? { id: 'usr-counselor', name: 'Dr. Aris Thorne (Counselor)', email: 'counselor@campus.edu', role: 'staff' }
      : { id: 'usr-student-01', name: 'Atharva Dev', email: 'student@codeforge.local', role: 'student' }
    return { token: 'mock-demo-token', user: mockUser }
  }
}

export async function getCurrentUser(): Promise<User> {
  const res = await api.get<User>('/api/v1/auth/me')
  return res.data
}

// 3. Student Dashboard
export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const res = await api.get<DashboardSummary>('/api/v1/dashboard/summary')
    return res.data
  } catch {
    // Fallback data
    return {
      student_name: 'Atharva',
      today_status: { completed: true, mood: 'very_low', stress_level: 5, sleep_quality: 1 },
      streak_days: 7,
      stress_trend: 'increasing',
      average_stress: 3.7,
      week_checkins_count: 7,
      wellbeing_insight: 'Elevated stress pattern detected for 4 consecutive days. Consider taking a short break, talking to someone you trust, or reaching out to campus support services.',
    }
  }
}

export async function getDashboardTrends(): Promise<DashboardTrends> {
  try {
    const res = await api.get<DashboardTrends>('/api/v1/dashboard/trends')
    return res.data
  } catch {
    return {
      history_7d: [
        { day: 'Wed', date: '2026-09-02', mood: 'happy', stress: 2, sleep: 3 },
        { day: 'Thu', date: '2026-09-03', mood: 'great', stress: 2, sleep: 3 },
        { day: 'Fri', date: '2026-09-04', mood: 'neutral', stress: 3, sleep: 2 },
        { day: 'Sat', date: '2026-09-05', mood: 'neutral', stress: 3, sleep: 2 },
        { day: 'Sun', date: '2026-09-06', mood: 'sad', stress: 4, sleep: 1 },
        { day: 'Mon', date: '2026-09-07', mood: 'sad', stress: 5, sleep: 1 },
        { day: 'Tue', date: '2026-09-08', mood: 'very_low', stress: 5, sleep: 1 },
      ],
      stress_trend: 'increasing',
      high_stress_streak: 3,
      support_signal_active: true,
    }
  }
}

// 4. Check-in submission & History
export async function submitDailyCheckin(payload: {
  date: string
  mood: string
  stress_level: number
  sleep_quality?: number
  academic_pressure?: number
  private_note?: string
}): Promise<CheckIn> {
  const res = await api.post<CheckIn>('/api/v1/checkins', payload)
  return res.data
}

export async function getCheckinHistory(params?: {
  from?: string
  to?: string
  search?: string
}): Promise<CheckIn[]> {
  try {
    const res = await api.get<CheckIn[]>('/api/v1/checkins', { params })
    return res.data
  } catch {
    return [
      { id: 7, student_id: 'usr-student-01', date: '2026-09-08', mood: 'very_low', stress_level: 5, sleep_quality: 1, academic_pressure: 5, private_note: 'Final project defense today. Hard to focus.', created_at: '2026-09-08T07:00:00Z' },
      { id: 6, student_id: 'usr-student-01', date: '2026-09-07', mood: 'sad', stress_level: 5, sleep_quality: 1, academic_pressure: 5, private_note: 'All-nighter preparing presentation slides.', created_at: '2026-09-07T07:00:00Z' },
      { id: 5, student_id: 'usr-student-01', date: '2026-09-06', mood: 'sad', stress_level: 4, sleep_quality: 2, academic_pressure: 4, private_note: 'Stress ramping up before exams.', created_at: '2026-09-06T07:00:00Z' },
      { id: 4, student_id: 'usr-student-01', date: '2026-09-05', mood: 'neutral', stress_level: 3, sleep_quality: 2, academic_pressure: 3, private_note: 'Weekend study group session.', created_at: '2026-09-05T07:00:00Z' },
      { id: 3, student_id: 'usr-student-01', date: '2026-09-04', mood: 'neutral', stress_level: 3, sleep_quality: 2, academic_pressure: 3, private_note: 'Normal classes, steady workload.', created_at: '2026-09-04T07:00:00Z' },
      { id: 2, student_id: 'usr-student-01', date: '2026-09-03', mood: 'great', stress_level: 2, sleep_quality: 3, academic_pressure: 2, private_note: 'Had a relaxing afternoon after lab.', created_at: '2026-09-03T07:00:00Z' },
      { id: 1, student_id: 'usr-student-01', date: '2026-09-02', mood: 'happy', stress_level: 2, sleep_quality: 3, academic_pressure: 2, private_note: 'Good start to the week!', created_at: '2026-09-02T07:00:00Z' },
    ]
  }
}

// 5. Staff Support Signals
export async function getStaffSupportSignals(): Promise<StaffSignalItem[]> {
  try {
    const res = await api.get<StaffSignalItem[]>('/api/v1/staff/support-signals')
    return res.data
  } catch {
    return [
      {
        id: 1,
        student_id: 'usr-student-01',
        student_name: 'Atharva Dev',
        student_email: 'student@codeforge.local',
        date_from: '2026-09-06',
        date_to: '2026-09-08',
        signal_type: 'high_stress_streak',
        reason: 'High stress (>= 4) reported for 3 consecutive days',
        status: 'active',
        created_at: '2026-09-08T07:10:21Z',
      },
      {
        id: 2,
        student_id: 'usr-student-03',
        student_name: 'Jordan Lee',
        student_email: 'jordan@codeforge.local',
        date_from: '2026-09-04',
        date_to: '2026-09-06',
        signal_type: 'high_stress_streak',
        reason: 'High stress (>= 4) reported for 3 consecutive days',
        status: 'contacted',
        created_at: '2026-09-06T08:30:00Z',
      },
    ]
  }
}

export async function updateStaffSignalStatus(signalId: number, status: string): Promise<void> {
  await api.post(`/api/v1/staff/support-signals/${signalId}/status`, { status })
}

// 6. Reset & Seed Demo Data
export async function seedDemoData(): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>('/api/v1/seed')
  return res.data
}
