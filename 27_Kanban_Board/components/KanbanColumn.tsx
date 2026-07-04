"use client"

import { KanbanCard, Task } from "./KanbanCard"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  onDrop: (taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  isDragOver?: boolean
}

export function KanbanColumn({
  title,
  tasks,
  onDrop,
  onDragOver,
  isDragOver,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4 transition-colors",
        isDragOver && "bg-gray-100"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData("taskId")
        onDrop(taskId)
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
