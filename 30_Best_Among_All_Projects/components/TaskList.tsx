"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit2, Check, X, Filter, Calendar } from "lucide-react"
import { toast } from "sonner"
import { storage } from "@/lib/storage"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: string | null
  createdAt: number
}

type FilterType = "all" | "active" | "completed"
type PriorityType = "all" | "low" | "medium" | "high"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [priorityFilter, setPriorityFilter] = useState<PriorityType>("all")

  useEffect(() => {
    const savedTasks = storage.get("tasks")
    if (savedTasks) {
      setTasks(savedTasks)
    }
  }, [])

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
    storage.set("tasks", updatedTasks)
  }

  const handleAddTask = () => {
    if (!newTaskText.trim()) {
      toast.error("Please enter a task")
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || null,
      createdAt: Date.now(),
    }

    saveTasks([newTask, ...tasks])
    setNewTaskText("")
    setNewTaskPriority("medium")
    setNewTaskDueDate("")
    toast.success("Task added successfully")
  }

  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    saveTasks(updatedTasks)
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    saveTasks(updatedTasks)
    toast.success("Task deleted")
  }

  const handleEditTask = (task: Task) => {
    setEditingId(task.id)
    setEditingText(task.text)
  }

  const handleSaveEdit = () => {
    if (!editingText.trim()) {
      toast.error("Task cannot be empty")
      return
    }

    const updatedTasks = tasks.map(task =>
      task.id === editingId ? { ...task, text: editingText.trim() } : task
    )
    saveTasks(updatedTasks)
    setEditingId(null)
    setEditingText("")
    toast.success("Task updated successfully")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesFilter = 
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed)
      
      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter

      return matchesFilter && matchesPriority
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "High"
      case "medium":
        return "Medium"
      case "low":
        return "Low"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false
    const dueDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  const filteredTasks = getFilteredTasks()
  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length

  return (
    <Card className="border-2 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Check className="w-6 h-6" />
            Task List
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} completed
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-1"
            />
            <Button onClick={handleAddTask} size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="flex-1"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All"
          />
          <FilterButton
            active={filter === "active"}
            onClick={() => setFilter("active")}
            label="Active"
          />
          <FilterButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
            label="Done"
          />
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="ml-auto px-3 py-1 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 max-h-96">
          {filteredTasks.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {tasks.length === 0 ? "No tasks yet. Add your first task!" : "No tasks match your filters"}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border transition-all ${
                  task.completed
                    ? "bg-muted/50 opacity-60"
                    : "bg-muted hover:border-primary"
                } ${isOverdue(task.dueDate) && !task.completed ? "border-red-500" : ""}`}
              >
                {editingId === task.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                      className="w-full"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="icon"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        variant="default"
                        size="icon"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Button
                      onClick={() => handleToggleComplete(task.id)}
                      variant="ghost"
                      size="icon"
                      className={`mt-1 flex-shrink-0 ${task.completed ? "text-green-600" : ""}`}
                    >
                      <Check className={`w-5 h-5 ${task.completed ? "fill-current" : ""}`} />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.text}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        
                        {task.dueDate && (
                          <span className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate) && !task.completed ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate) && !task.completed && " (Overdue)"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleEditTask(task)}
                        variant="ghost"
                        size="icon"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        variant="ghost"
                        size="icon"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "default" : "outline"}
      size="sm"
      className="flex-1"
    >
      {label}
    </Button>
  )
}
