"use client"

import { KanbanBoard } from "@/components/KanbanBoard"
import { ToasterProvider } from "@/components/ui/toaster"

export default function Home() {
  return (
    <ToasterProvider>
      <KanbanBoard />
    </ToasterProvider>
  )
}
