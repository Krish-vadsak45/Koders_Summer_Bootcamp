"use client"

import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  tags: string[]
}

interface KanbanCardProps {
  task: Task
  isDragging?: boolean
}

export function KanbanCard({ task, isDragging }: KanbanCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
        isDragging && "opacity-50"
      )}
      draggable
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full border",
              priorityColors[task.priority]
            )}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
        </div>
        <GripVertical className="text-gray-400 flex-shrink-0" />
      </div>
    </div>
  )
}
