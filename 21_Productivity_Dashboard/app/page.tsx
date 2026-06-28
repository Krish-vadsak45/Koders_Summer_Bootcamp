import Calculator from "@/components/Calculator"
import Clock from "@/components/Clock"
import Notes from "@/components/Notes"
import Pomodoro from "@/components/Pomodoro"
import TaskList from "@/components/TaskList"
import Calendar from "@/components/Calendar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Productivity Dashboard
          </h1>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Calculator />
          <Clock />
          <Notes />
          <Pomodoro />
          <TaskList />
          <Calendar />
        </div>
      </div>
    </main>
  )
}
