import { Habit, HabitStats } from '@/types/habit'

const STORAGE_KEY = 'habits_tracker'

export const getStoredHabits = (): Habit[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveHabits = (habits: Habit[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}

export const getTodayDate = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export const getDateRange = (days: number): string[] => {
  const dates: string[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  return dates
}

export const calculateStats = (habit: Habit): HabitStats => {
  const completions = habit.completions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Calculate current streak
  let currentStreak = 0
  const today = getTodayDate()
  let checkDate = new Date(today)

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0]
    const completion = completions.find((c) => c.date === dateStr)

    if (completion?.completed) {
      currentStreak++
    } else if (i > 0) {
      break
    }

    checkDate.setDate(checkDate.getDate() - 1)
  }

  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 0

  completions.forEach((completion) => {
    if (completion.completed) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  })

  // Calculate total completions
  const totalCompletions = completions.filter((c) => c.completed).length

  // Calculate completion rate
  const completionRate =
    completions.length > 0
      ? Math.round((totalCompletions / completions.length) * 100)
      : 0

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
  }
}

export const isHabitCompletedToday = (habit: Habit): boolean => {
  const today = getTodayDate()
  return habit.completions.some((c) => c.date === today && c.completed)
}

export const toggleHabitCompletion = (
  habit: Habit,
  date: string,
  completed: boolean
): Habit => {
  const existingIndex = habit.completions.findIndex((c) => c.date === date)

  if (existingIndex > -1) {
    habit.completions[existingIndex].completed = completed
  } else {
    habit.completions.push({ date, completed })
  }

  return habit
}

export const deleteHabit = (habits: Habit[], habitId: string): Habit[] => {
  return habits.filter((h) => h.id !== habitId)
}

export const createHabit = (
  name: string,
  description: string,
  frequency: 'daily' | 'weekly',
  color: string,
  icon: string
): Habit => {
  return {
    id: Date.now().toString(),
    name,
    description,
    frequency,
    color,
    icon,
    createdAt: Date.now(),
    completions: [],
  }
}

export const getCompletionPercentageForWeek = (
  habit: Habit,
  daysBack: number = 7
): number => {
  const dates = getDateRange(daysBack)
  const completed = dates.filter((date) =>
    habit.completions.some((c) => c.date === date && c.completed)
  ).length

  return Math.round((completed / daysBack) * 100)
}

export const getHabitCompletionForDate = (
  habit: Habit,
  date: string
): boolean => {
  const completion = habit.completions.find((c) => c.date === date)
  return completion?.completed || false
}
