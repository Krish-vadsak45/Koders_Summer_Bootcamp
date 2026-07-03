import * as React from "react"
import { Avatar } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { MoreVertical, Phone, Video } from "lucide-react"
import { Button } from "./ui/button"

interface ChatHeaderProps {
  roomName: string
  onlineCount: number
  avatar?: string
}

export default function ChatHeader({ roomName, onlineCount, avatar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar src={avatar} fallback={roomName.charAt(0)} />
        <div>
          <h2 className="font-semibold">{roomName}</h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">{onlineCount} online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
