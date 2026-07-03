import * as React from "react"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Plus, Search, Hash, Users } from "lucide-react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

interface ChatRoom {
  id: string
  name: string
  lastMessage: string
  unreadCount: number
  online: boolean
  avatar?: string
  type: "channel" | "dm"
}

interface ChatSidebarProps {
  rooms: ChatRoom[]
  activeRoom: string
  onRoomSelect: (roomId: string) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
}

export default function ChatSidebar({ rooms, activeRoom, onRoomSelect, isMobileOpen, onCloseMobile }: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "w-80 border-r flex flex-col bg-muted/30",
        isMobileOpen ? "fixed inset-y-0 left-0 z-50" : "hidden md:flex"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Messages</h2>
          <Button size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
              <Hash className="h-4 w-4" />
              Channels
            </div>
            {rooms.filter(r => r.type === "channel").map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onRoomSelect(room.id)
                  onCloseMobile()
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                  activeRoom === room.id ? "bg-accent" : ""
                )}
              >
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{room.name}</span>
                    {room.unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{room.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Direct Messages
            </div>
            {rooms.filter(r => r.type === "dm").map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onRoomSelect(room.id)
                  onCloseMobile()
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                  activeRoom === room.id ? "bg-accent" : ""
                )}
              >
                <div className="relative">
                  <Avatar src={room.avatar} fallback={room.name.charAt(0)} />
                  {room.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{room.name}</span>
                    {room.unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{room.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
