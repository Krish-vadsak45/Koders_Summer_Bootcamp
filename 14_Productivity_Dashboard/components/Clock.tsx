"use client"

import { useState, useEffect, useRef } from "react"
import { Clock as ClockIcon, Timer, Globe, Play, Pause, RotateCcw, Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Tab = "clock" | "stopwatch" | "timer" | "world"

export default function Clock() {
  const [activeTab, setActiveTab] = useState<Tab>("clock")
  const [time, setTime] = useState<Date | null>(null)
  const [is24Hour, setIs24Hour] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null)

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerRemaining, setTimerRemaining] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // World clock state
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York")
  const [worldTime, setWorldTime] = useState<Date | null>(null)

  const timezones = [
    { value: "America/New_York", label: "New York" },
    { value: "Europe/London", label: "London" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Australia/Sydney", label: "Sydney" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Asia/Dubai", label: "Dubai" },
  ]

  useEffect(() => {
    setMounted(true)
    setTime(new Date())
    setWorldTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
      setWorldTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Stopwatch effect
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 10)
      }, 10)
    } else {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current)
      }
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current)
    }
  }, [stopwatchRunning])

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1000) {
            setTimerRunning(false)
            toast.success("Timer finished!")
            return 0
          }
          return prev - 1000
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
  }, [timerRunning, timerRemaining])

  const formatTime = (date: Date) => {
    if (is24Hour) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatStopwatchTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
  }

  const formatTimerTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const handleToggleFormat = () => {
    setIs24Hour(!is24Hour)
    toast.success(`Switched to ${!is24Hour ? "24-hour" : "12-hour"} format`)
  }

  const handleStopwatchReset = () => {
    setStopwatchTime(0)
    setStopwatchRunning(false)
  }

  const handleTimerStart = () => {
    if (timerRemaining === 0) {
      setTimerRemaining((timerMinutes * 60 + timerSeconds) * 1000)
    }
    setTimerRunning(true)
  }

  const handleTimerReset = () => {
    setTimerRunning(false)
    setTimerRemaining(0)
  }

  const formatWorldTime = (date: Date, timezone: string) => {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const formatWorldDate = (date: Date, timezone: string) => {
    return date.toLocaleDateString("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="w-6 h-6" />
          Clock
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2 mb-4">
          <TabButton active={activeTab === "clock"} onClick={() => setActiveTab("clock")} icon={ClockIcon} label="Clock" />
          <TabButton active={activeTab === "stopwatch"} onClick={() => setActiveTab("stopwatch")} icon={Timer} label="Stopwatch" />
          <TabButton active={activeTab === "timer"} onClick={() => setActiveTab("timer")} icon={Timer} label="Timer" />
          <TabButton active={activeTab === "world"} onClick={() => setActiveTab("world")} icon={Globe} label="World" />
        </div>

        {activeTab === "clock" && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Button
                onClick={handleToggleFormat}
                variant="default"
              >
                {is24Hour ? "24H" : "12H"}
              </Button>
            </div>
            <div className="text-5xl md:text-6xl font-mono font-bold mb-4">
              {time ? formatTime(time) : "--:--:--"}
            </div>
            <div className="text-lg text-muted-foreground">
              {time ? formatDate(time) : "Loading..."}
            </div>
          </div>
        )}

        {activeTab === "stopwatch" && (
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-mono font-bold mb-6">
              {formatStopwatchTime(stopwatchTime)}
            </div>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
                variant={stopwatchRunning ? "secondary" : "default"}
                size="icon"
                className="rounded-full w-16 h-16"
              >
                {stopwatchRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button
                onClick={handleStopwatchReset}
                variant="destructive"
                size="icon"
                className="rounded-full w-16 h-16"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "timer" && (
          <div className="text-center">
            {!timerRunning && timerRemaining === 0 && (
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setTimerMinutes(Math.max(0, timerMinutes - 1))}
                    variant="outline"
                    size="icon"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-mono font-bold w-12">{String(timerMinutes).padStart(2, '0')}</span>
                  <Button
                    onClick={() => setTimerMinutes(Math.min(99, timerMinutes + 1))}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-3xl font-mono">:</span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setTimerSeconds(Math.max(0, timerSeconds - 5))}
                    variant="outline"
                    size="icon"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-mono font-bold w-12">{String(timerSeconds).padStart(2, '0')}</span>
                  <Button
                    onClick={() => setTimerSeconds(Math.min(55, timerSeconds + 5))}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="text-5xl md:text-6xl font-mono font-bold mb-6">
              {timerRemaining > 0 ? formatTimerTime(timerRemaining) : formatTimerTime((timerMinutes * 60 + timerSeconds) * 1000)}
            </div>
            <div className="flex justify-center gap-3">
              {!timerRunning ? (
                <Button
                  onClick={handleTimerStart}
                  variant="default"
                  size="icon"
                  className="rounded-full w-16 h-16"
                >
                  <Play className="w-6 h-6" />
                </Button>
              ) : (
                <Button
                  onClick={() => setTimerRunning(false)}
                  variant="secondary"
                  size="icon"
                  className="rounded-full w-16 h-16"
                >
                  <Pause className="w-6 h-6" />
                </Button>
              )}
              <Button
                onClick={handleTimerReset}
                variant="destructive"
                size="icon"
                className="rounded-full w-16 h-16"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "world" && (
          <div className="text-center">
            <div className="mb-4">
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
            <div className="text-5xl md:text-6xl font-mono font-bold mb-4">
              {worldTime ? formatWorldTime(worldTime, selectedTimezone) : "--:--:--"}
            </div>
            <div className="text-lg text-muted-foreground mb-4">
              {worldTime ? formatWorldDate(worldTime, selectedTimezone) : "Loading..."}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm max-h-48 overflow-y-auto">
              {timezones.filter(tz => tz.value !== selectedTimezone).map(tz => (
                <div key={tz.value} className="p-2 bg-muted rounded-lg">
                  <div className="font-semibold">{tz.label}</div>
                  <div className="font-mono">{worldTime ? formatWorldTime(worldTime, tz.value) : "--:--"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "default" : "outline"}
      className="flex-1 min-w-0"
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="ml-2 truncate">{label}</span>
    </Button>
  )
}
