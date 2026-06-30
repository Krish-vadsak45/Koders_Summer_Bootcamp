'use client'

import { Habit } from '@/types/habit'
import { calculateStats } from '@/lib/habitUtils'
import { Card } from 'primereact/card'

interface StatisticsProps {
  habits: Habit[]
}

export default function Statistics({ habits }: StatisticsProps) {
  const totalHabits = habits.length
  const totalCompletions = habits.reduce((sum, habit) => {
    const stats = calculateStats(habit)
    return sum + stats.totalCompletions
  }, 0)

  const averageStreak =
    totalHabits > 0
      ? Math.round(
          habits.reduce((sum, habit) => {
            const stats = calculateStats(habit)
            return sum + stats.currentStreak
          }, 0) / totalHabits
        )
      : 0

  const bestStreak = Math.max(
    0,
    ...habits.map((habit) => calculateStats(habit).longestStreak)
  )

  const completedToday = habits.filter((habit) => {
    const today = new Date().toISOString().split('T')[0]
    return habit.completions.some((c) => c.date === today && c.completed)
  }).length

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="text-center">
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {totalHabits}
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Total Habits
        </p>
      </Card>

      <Card className="text-center">
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
          {completedToday}
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Completed Today
        </p>
      </Card>

      <Card className="text-center">
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {totalCompletions}
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Total Completions
        </p>
      </Card>

      <Card className="text-center">
        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
          {bestStreak}
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Best Streak
        </p>
      </Card>
    </div>
  )
}
