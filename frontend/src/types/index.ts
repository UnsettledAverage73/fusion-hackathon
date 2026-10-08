export type NavSection = 'dashboard' | 'checkin' | 'history' | 'staff' | 'settings'

export type UserRole = 'student' | 'staff'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  picture?: string | null
}

export type MoodType = 'great' | 'happy' | 'neutral' | 'sad' | 'very_low'

export interface CheckIn {
  id: number
  student_id: string
  date: string
  mood: string
  stress_level: number
  sleep_quality?: number | null
  academic_pressure?: number | null
  private_note?: string | null
  created_at: string
}

export interface TodayStatus {
  completed: boolean
  mood?: string | null
  stress_level?: number | null
  sleep_quality?: number | null
}

export interface DashboardSummary {
  student_name: string
  today_status: TodayStatus
  streak_days: number
  stress_trend: string
  average_stress: number
  week_checkins_count: number
  wellbeing_insight: string
}

export interface DayTrendItem {
  day: string
  date: string
  mood: string
  stress: number
  sleep?: number | null
}

export interface DashboardTrends {
  history_7d: DayTrendItem[]
  stress_trend: string
  high_stress_streak: number
  support_signal_active: boolean
}

export interface StaffSignalItem {
  id: number
  student_id: string
  student_name: string
  student_email?: string
  date_from: string
  date_to: string
  signal_type: string
  reason: string
  status: string
  created_at: string
  // NOTE: Zero private student notes exposed per Requirement 07!
}
