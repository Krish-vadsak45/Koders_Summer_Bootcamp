export interface Habit {
  id: string
  name: string
  description: string
  frequency: 'daily' | 'weekly'
  color: string
  icon: string
  createdAt: number
  completions: HabitCompletion[]
}

export interface HabitCompletion {
  date: string // YYYY-MM-DD format
  completed: boolean
}

export interface HabitStats {
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  completionRate: number
}
