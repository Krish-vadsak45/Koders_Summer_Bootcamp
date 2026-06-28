"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    return selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Calendar
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handlePreviousMonth}
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h3 className="text-xl font-bold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
          </div>

          <Button
            onClick={handleNextMonth}
            variant="outline"
            size="icon"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <Button
            onClick={handleToday}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Today
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => (
            <div
              key={index}
              onClick={() => date && handleDateClick(date)}
              className={`
                aspect-square flex items-center justify-center rounded-lg cursor-pointer text-sm font-medium transition-all
                ${date ? "hover:bg-accent hover:text-accent-foreground" : ""}
                ${date && isToday(date) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                ${date && isSelected(date) && !isToday(date) ? "bg-primary/20 text-primary" : ""}
                ${!date ? "pointer-events-none" : ""}
              `}
            >
              {date ? date.getDate() : ""}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Selected Date</p>
            <p className="font-semibold">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
