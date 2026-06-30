'use client'

import { Habit } from '@/types/habit'
import { getDateRange, getHabitCompletionForDate } from '@/lib/habitUtils'
import { Card } from 'primereact/card'

interface HabitChartProps {
  habit: Habit
}

export default function HabitChart({ habit }: HabitChartProps) {
  const dates = getDateRange(84) // 12 weeks
  const weeks: string[][] = []

  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7))
  }

  return (
    <Card className="mb-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: habit.color }}
          >
            <i className={`${habit.icon} text-lg`}></i>
          </div>
          <div>
            <h3 className="font-bold">{habit.name}</h3>
            <p className="text-sm text-gray-500">Last 12 weeks</p>
          </div>
        </div>

        {/* 12-Week Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="mb-1 flex gap-1">
                {week.map((date) => {
                  const isCompleted = getHabitCompletionForDate(habit, date)
                  const dateObj = new Date(date)
                  const dayName = dateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })

                  return (
                    <div
                      key={date}
                      className="group relative"
                      title={`${dayName}: ${isCompleted ? 'Completed ✓' : 'Not completed'}`}
                    >
                      <div
                        className={`h-6 w-6 rounded-sm transition-all ${
                          isCompleted
                            ? 'opacity-100'
                            : 'bg-gray-200 opacity-30 dark:bg-gray-700'
                        }`}
                        style={
                          isCompleted ? { backgroundColor: habit.color } : {}
                        }
                      />
                      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                        {dayName}
                        {isCompleted && ' ✓'}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between border-t pt-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Less
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-sm"
                style={{
                  backgroundColor: habit.color,
                  opacity: i / 5,
                }}
              />
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            More
          </span>
        </div>
      </div>
    </Card>
  )
}
