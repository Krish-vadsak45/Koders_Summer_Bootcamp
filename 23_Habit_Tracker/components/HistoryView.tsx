'use client'

import { useState } from 'react'
import { Habit } from '@/types/habit'
import { getDateRange, getHabitCompletionForDate, toggleHabitCompletion } from '@/lib/habitUtils'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'

interface HistoryViewProps {
  habit: Habit
  onUpdate: (habit: Habit) => void
}

export default function HistoryView({ habit, onUpdate }: HistoryViewProps) {
  const [viewDays, setViewDays] = useState(30)
  const dates = getDateRange(viewDays)

  const handleToggleDate = (date: string) => {
    const isCompleted = getHabitCompletionForDate(habit, date)
    const updated = toggleHabitCompletion({ ...habit }, date, !isCompleted)
    onUpdate(updated)
  }

  // Group dates by week
  const weeks: string[][] = []
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7))
  }

  return (
    <Card className="mb-4">
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h3 className="text-lg font-bold">{habit.name} - History</h3>
          <div className="flex gap-2">
            <Button
              label="7 Days"
              severity={viewDays === 7 ? 'info' : 'secondary'}
              onClick={() => setViewDays(7)}
              size="small"
            />
            <Button
              label="30 Days"
              severity={viewDays === 30 ? 'info' : 'secondary'}
              onClick={() => setViewDays(30)}
              size="small"
            />
            <Button
              label="90 Days"
              severity={viewDays === 90 ? 'info' : 'secondary'}
              onClick={() => setViewDays(90)}
              size="small"
            />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="mb-2 flex gap-1">
                {week.map((date) => {
                  const isCompleted = getHabitCompletionForDate(habit, date)
                  const dateObj = new Date(date)
                  const dayName = dateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                  const dayNumber = dateObj.getDate()
                  const monthName = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                  })

                  return (
                    <button
                      key={date}
                      onClick={() => handleToggleDate(date)}
                      className="group relative h-12 w-12 rounded-lg border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: isCompleted ? habit.color : 'transparent',
                        borderColor: habit.color,
                        opacity: isCompleted ? 1 : 0.2,
                      }}
                      title={dayName}
                    >
                      <span className="text-sm font-semibold">{dayNumber}</span>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                        {dayName}
                        {isCompleted && ' ✓'}
                      </div>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics for period */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Days Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {dates.filter((d) => getHabitCompletionForDate(habit, d)).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  (dates.filter((d) => getHabitCompletionForDate(habit, d)).length /
                    viewDays) *
                    100
                )}
                %
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Days Missed</p>
              <p className="text-2xl font-bold text-red-600">
                {dates.filter((d) => !getHabitCompletionForDate(habit, d)).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
