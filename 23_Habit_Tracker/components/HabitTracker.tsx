'use client'

import { useEffect, useState } from 'react'
import { Habit } from '@/types/habit'
import { getStoredHabits, saveHabits } from '@/lib/habitUtils'
import HabitForm from './HabitForm'
import HabitCard from './HabitCard'
import HabitChart from './HabitChart'
import HistoryView from './HistoryView'
import Statistics from './Statistics'
import { Button } from 'primereact/button'
import { TabView, TabPanel } from 'primereact/tabview'
import { Toolbar } from 'primereact/toolbar'
import { Message } from 'primereact/message'

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load habits from localStorage
  useEffect(() => {
    const stored = getStoredHabits()
    setHabits(stored)
    setIsLoaded(true)
  }, [])

  // Save habits to localStorage
  useEffect(() => {
    if (isLoaded) {
      saveHabits(habits)
    }
  }, [habits, isLoaded])

  const handleAddHabit = (newHabit: Habit) => {
    setHabits([...habits, newHabit])
  }

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)))
    if (selectedHabit?.id === updatedHabit.id) {
      setSelectedHabit(updatedHabit)
    }
  }

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      setHabits(habits.filter((h) => h.id !== habitId))
      if (selectedHabit?.id === habitId) {
        setSelectedHabit(null)
        setActiveTab(0)
      }
    }
  }

  const toolbarStart = (
    <div className="flex items-center gap-2">
      <i className="pi pi-star text-xl text-yellow-500"></i>
      <span className="text-lg font-bold">Habit Tracker</span>
    </div>
  )

  const toolbarEnd = (
    <Button
      label="Add Habit"
      icon="pi pi-plus"
      onClick={() => setShowForm(true)}
    />
  )

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-3xl"></i>
          <p className="mt-4 text-gray-600">Loading habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Toolbar
        start={toolbarStart}
        end={toolbarEnd}
        className="mb-6 rounded-lg border-0 shadow-lg"
      />

      {/* Add Habit Form */}
      <HabitForm
        visible={showForm}
        onHide={() => setShowForm(false)}
        onAddHabit={handleAddHabit}
      />

      {/* Main Content */}
      {habits.length === 0 ? (
        <Message
          severity="info"
          text="No habits yet. Create your first habit to get started!"
          icon="pi pi-info-circle"
          className="mb-6 w-full"
        />
      ) : (
        <>
          {/* Statistics Section */}
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              Overview
            </h2>
            <Statistics habits={habits} />
          </div>

          {/* Tabs Section */}
          <div className="rounded-lg bg-white shadow-lg dark:bg-gray-800">
            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
              {/* Dashboard Tab */}
              <TabPanel header="Dashboard" leftIcon="pi pi-home">
                <div className="space-y-4 py-4">
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onUpdate={handleUpdateHabit}
                      onDelete={handleDeleteHabit}
                    />
                  ))}
                </div>
              </TabPanel>

              {/* Analytics Tab */}
              <TabPanel header="Analytics" leftIcon="pi pi-chart-bar">
                <div className="space-y-4 py-4">
                  {habits.length === 0 ? (
                    <p className="py-8 text-center text-gray-600 dark:text-gray-400">
                      No habits to analyze
                    </p>
                  ) : (
                    habits.map((habit) => (
                      <HabitChart key={habit.id} habit={habit} />
                    ))
                  )}
                </div>
              </TabPanel>

              {/* History Tab */}
              <TabPanel header="History" leftIcon="pi pi-calendar">
                {selectedHabit ? (
                  <div className="py-4">
                    <Button
                      label="← Back to Habits"
                      text
                      icon="pi pi-arrow-left"
                      onClick={() => {
                        setSelectedHabit(null)
                      }}
                      className="mb-4"
                    />
                    <HistoryView
                      habit={selectedHabit}
                      onUpdate={handleUpdateHabit}
                    />
                  </div>
                ) : (
                  <div className="space-y-3 py-4">
                    {habits.map((habit) => (
                      <button
                        key={habit.id}
                        onClick={() => setSelectedHabit(habit)}
                        className="block w-full rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-500"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: habit.color }}
                          >
                            <i className={`${habit.icon} text-lg`}></i>
                          </div>
                          <div>
                            <h4 className="font-bold">{habit.name}</h4>
                            <p className="text-sm text-gray-500">
                              {habit.completions.length} days recorded
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel header="Settings" leftIcon="pi pi-cog">
                <div className="space-y-4 py-4">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h3 className="mb-2 font-bold text-blue-900 dark:text-blue-100">
                      Data Export
                    </h3>
                    <p className="mb-4 text-sm text-blue-800 dark:text-blue-200">
                      Download your habit data as JSON for backup or analysis.
                    </p>
                    <Button
                      label="Export Data"
                      icon="pi pi-download"
                      onClick={() => {
                        const dataStr = JSON.stringify(habits, null, 2)
                        const dataBlob = new Blob([dataStr], {
                          type: 'application/json',
                        })
                        const url = URL.createObjectURL(dataBlob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `habits-${new Date().toISOString().split('T')[0]}.json`
                        link.click()
                        URL.revokeObjectURL(url)
                      }}
                    />
                  </div>

                  <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                    <h3 className="mb-2 font-bold text-red-900 dark:text-red-100">
                      Clear All Data
                    </h3>
                    <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                      Warning: This will permanently delete all habits and their history.
                    </p>
                    <Button
                      label="Clear All"
                      severity="danger"
                      icon="pi pi-trash"
                      onClick={() => {
                        if (
                          confirm(
                            'Are you sure you want to delete all habits? This cannot be undone.'
                          )
                        ) {
                          setHabits([])
                          setSelectedHabit(null)
                        }
                      }}
                    />
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <h3 className="mb-2 font-bold">About</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Habit Tracker v1.0 - Built with Next.js, TypeScript, and PrimeReact
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      All data is stored locally in your browser. No data is sent to any server.
                    </p>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </>
      )}
    </div>
  )
}
