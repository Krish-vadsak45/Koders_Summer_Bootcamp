'use client'

import { Habit } from '@/types/habit'
import {
  calculateStats,
  getCompletionPercentageForWeek,
  getHabitCompletionForDate,
  getTodayDate,
  toggleHabitCompletion,
} from '@/lib/habitUtils'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { useState, useEffect } from 'react'

interface HabitCardProps {
  habit: Habit
  onUpdate: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

export default function HabitCard({
  habit,
  onUpdate,
  onDelete,
}: HabitCardProps) {
  const [stats, setStats] = useState(calculateStats(habit))
  const [weeklyPercentage, setWeeklyPercentage] = useState(0)
  const [isCompletedToday, setIsCompletedToday] = useState(false)

  useEffect(() => {
    const today = getTodayDate()
    setIsCompletedToday(getHabitCompletionForDate(habit, today))
    setStats(calculateStats(habit))
    setWeeklyPercentage(getCompletionPercentageForWeek(habit, 7))
  }, [habit])

  const handleToggleToday = () => {
    const today = getTodayDate()
    const updated = toggleHabitCompletion(
      { ...habit },
      today,
      !isCompletedToday
    )
    setIsCompletedToday(!isCompletedToday)
    onUpdate(updated)
  }

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: habit.color }}
        >
          <i className={`${habit.icon} text-xl`}></i>
        </div>
        <div>
          <h3 className="font-bold text-lg">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500">{habit.description}</p>
          )}
        </div>
      </div>
    </div>
  )

  const footer = (
    <div className="flex gap-2">
      <Button
        icon="pi pi-trash"
        severity="danger"
        text
        onClick={() => onDelete(habit.id)}
        className="p-1"
      />
    </div>
  )

  return (
    <Card header={header} footer={footer} className="mb-4">
      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current Streak
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.currentStreak}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 text-center dark:bg-purple-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Longest Streak
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.longestStreak}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total Completed
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalCompletions}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-3 text-center dark:bg-orange-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Completion Rate
            </p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.completionRate}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-semibold">This Week</span>
            <span className="text-gray-600 dark:text-gray-400">
              {weeklyPercentage}%
            </span>
          </div>
          <ProgressBar
            value={weeklyPercentage}
            showValue={false}
            style={{ height: '8px' }}
          />
        </div>

        {/* Frequency Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              habit.frequency === 'daily'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            }`}
          >
            {habit.frequency}
          </span>

          {/* Check Today Button */}
          <Button
            label={isCompletedToday ? 'Completed Today ✓' : 'Mark Complete'}
            severity={isCompletedToday ? 'success' : 'info'}
            onClick={handleToggleToday}
            size="small"
            icon={isCompletedToday ? 'pi pi-check' : 'pi pi-check-circle'}
          />
        </div>
      </div>
    </Card>
  )
}
