"use client"

import { useState } from "react"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard, Task } from "./KanbanCard"
import { useToast } from "./ui/toaster"
import { Plus } from "lucide-react"

export function KanbanBoard() {
  const { addToast } = useToast()
  const [columns, setColumns] = useState({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Design System Setup",
          description: "Create design tokens and component library",
          priority: "high",
          tags: ["design", "ui"],
        },
        {
          id: "2",
          title: "User Research",
          description: "Conduct user interviews and surveys",
          priority: "medium",
          tags: ["research"],
        },
        {
          id: "3",
          title: "API Documentation",
          description: "Document all API endpoints",
          priority: "low",
          tags: ["documentation"],
        },
      ],
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        {
          id: "4",
          title: "Dashboard Implementation",
          description: "Build the main dashboard interface",
          priority: "high",
          tags: ["frontend", "react"],
        },
        {
          id: "5",
          title: "Database Schema",
          description: "Design and implement database structure",
          priority: "medium",
          tags: ["backend", "database"],
        },
      ],
    },
    done: {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "6",
          title: "Project Setup",
          description: "Initialize project structure and dependencies",
          priority: "high",
          tags: ["setup"],
        },
        {
          id: "7",
          title: "CI/CD Pipeline",
          description: "Set up automated deployment pipeline",
          priority: "medium",
          tags: ["devops"],
        },
      ],
    },
  })

  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return

    setColumns((prev) => {
      const newColumns = { ...prev }
      
      // Find and remove task from source column
      let sourceColumnId: string | null = null
      for (const [colId, col] of Object.entries(newColumns)) {
        if (col.tasks.some((t) => t.id === draggedTask.id)) {
          sourceColumnId = colId
          break
        }
      }

      if (sourceColumnId && sourceColumnId !== targetColumnId) {
        newColumns[sourceColumnId] = {
          ...newColumns[sourceColumnId],
          tasks: newColumns[sourceColumnId].tasks.filter(
            (t) => t.id !== draggedTask.id
          ),
        }
        newColumns[targetColumnId] = {
          ...newColumns[targetColumnId],
          tasks: [...newColumns[targetColumnId].tasks, draggedTask],
        }

        addToast({
          message: `Task moved to ${newColumns[targetColumnId].title}`,
          type: "success",
        })
      }

      return newColumns
    })

    setDraggedTask(null)
    setDragOverColumn(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kanban Board
            </h1>
            <p className="text-gray-600">
              Drag and drop tasks to organize your workflow
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {Object.values(columns).map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              tasks={column.tasks}
              onDrop={(taskId) => handleDrop(column.id)}
              onDragOver={(e) => handleDragOver(e, column.id)}
              isDragOver={dragOverColumn === column.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
