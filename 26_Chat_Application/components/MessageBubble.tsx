import * as React from "react"
import { Avatar } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: string
  sender: string
  isOwn: boolean
  timestamp: string
  avatar?: string
}

export default function MessageBubble({ message, sender, isOwn, timestamp, avatar }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3 mb-4", isOwn ? "flex-row-reverse" : "flex-row")}>
      <Avatar src={avatar} fallback={sender.charAt(0)} />
      <div className={cn("flex flex-col max-w-[70%]", isOwn ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{sender}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          )}
        >
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}
