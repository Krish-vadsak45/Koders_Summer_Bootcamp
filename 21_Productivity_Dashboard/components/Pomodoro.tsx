"use client"

import { useState, useEffect, useRef } from "react"
import { Timer, Play, Pause, RotateCcw, Coffee, Briefcase } from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PomodoroMode = "work" | "shortBreak" | "longBreak"

interface PomodoroSettings {
  work: number
  shortBreak: number
  longBreak: number
}

const defaultSettings: PomodoroSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
}

export default function Pomodoro() {
  const [mode, setMode] = useState<PomodoroMode>("work")
  const [timeLeft, setTimeLeft] = useState(defaultSettings.work * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    
    if (mode === "work") {
      const newSessionCount = sessionCount + 1
      setSessionCount(newSessionCount)
      
      if (newSessionCount % 4 === 0) {
        setMode("longBreak")
        setTimeLeft(settings.longBreak * 60)
        toast.success("Work session complete! Time for a long break.")
      } else {
        setMode("shortBreak")
        setTimeLeft(settings.shortBreak * 60)
        toast.success("Work session complete! Time for a short break.")
      }
    } else {
      setMode("work")
      setTimeLeft(settings.work * 60)
      toast.success("Break over! Ready to focus again?")
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(settings[mode] * 60)
  }

  const handleModeChange = (newMode: PomodoroMode) => {
    setMode(newMode)
    setTimeLeft(settings[newMode] * 60)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getModeColor = () => {
    switch (mode) {
      case "work":
        return "from-blue-500 to-purple-600"
      case "shortBreak":
        return "from-green-500 to-teal-600"
      case "longBreak":
        return "from-orange-500 to-red-600"
    }
  }

  const getModeIcon = () => {
    switch (mode) {
      case "work":
        return Briefcase
      case "shortBreak":
      case "longBreak":
        return Coffee
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case "work":
        return "Focus Time"
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
    }
  }

  const progress = ((settings[mode] * 60 - timeLeft) / (settings[mode] * 60)) * 100

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="w-6 h-6" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2 mb-6">
          <ModeButton
            active={mode === "work"}
            onClick={() => handleModeChange("work")}
            label="Focus"
            icon={Briefcase}
          />
          <ModeButton
            active={mode === "shortBreak"}
            onClick={() => handleModeChange("shortBreak")}
            label="Short"
            icon={Coffee}
          />
          <ModeButton
            active={mode === "longBreak"}
            onClick={() => handleModeChange("longBreak")}
            label="Long"
            icon={Coffee}
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 rounded-full" />
          <div
            className="absolute inset-0 bg-gradient-to-br rounded-full transition-all duration-1000"
            style={{
              background: `linear-gradient(to right, ${getModeColor().replace("from-", "").replace(" to-", ", ")})`,
              width: `${progress}%`,
              opacity: 0.2,
            }}
          />
          <div className="relative flex flex-col items-center justify-center py-8">
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const Icon = getModeIcon()
                return <Icon className="w-5 h-5 text-muted-foreground" />
              })()}
              <span className="text-sm text-muted-foreground">{getModeLabel()}</span>
            </div>
            <div className="text-6xl md:text-7xl font-mono font-bold mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground">
              Session {sessionCount + 1}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              variant="default"
              size="icon"
              className="rounded-full w-16 h-16"
            >
              <Play className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="secondary"
              size="icon"
              className="rounded-full w-16 h-16"
            >
              <Pause className="w-6 h-6" />
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="destructive"
            size="icon"
            className="rounded-full w-16 h-16"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Complete 4 focus sessions for a long break</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ModeButton({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: any }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "default" : "outline"}
      className="flex-1"
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}
