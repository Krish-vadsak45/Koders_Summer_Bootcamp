"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import ChatSidebar from "./ChatSidebar"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"

interface Message {
  id: string
  sender: string
  message: string
  isOwn: boolean
  timestamp: string
  avatar?: string
}

interface ChatRoom {
  id: string
  name: string
  lastMessage: string
  unreadCount: number
  online: boolean
  avatar?: string
  type: "channel" | "dm"
}

export default function ChatApplication() {
  const [activeRoom, setActiveRoom] = React.useState("general")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      sender: "Alice",
      message: "Hey everyone! How's it going?",
      isOwn: false,
      timestamp: "10:30 AM",
      avatar: undefined
    },
    {
      id: "2",
      sender: "Bob",
      message: "Pretty good! Working on some new features.",
      isOwn: false,
      timestamp: "10:32 AM",
      avatar: undefined
    },
    {
      id: "3",
      sender: "You",
      message: "That sounds exciting! What kind of features?",
      isOwn: true,
      timestamp: "10:35 AM",
      avatar: undefined
    }
  ])

  const [rooms] = React.useState<ChatRoom[]>([
    {
      id: "general",
      name: "general",
      lastMessage: "That sounds exciting!",
      unreadCount: 0,
      online: true,
      type: "channel"
    },
    {
      id: "random",
      name: "random",
      lastMessage: "Anyone up for a game?",
      unreadCount: 3,
      online: true,
      type: "channel"
    },
    {
      id: "help",
      name: "help",
      lastMessage: "Check the documentation",
      unreadCount: 0,
      online: true,
      type: "channel"
    },
    {
      id: "alice",
      name: "Alice",
      lastMessage: "See you later!",
      unreadCount: 1,
      online: true,
      type: "dm"
    },
    {
      id: "bob",
      name: "Bob",
      lastMessage: "Thanks for the help",
      unreadCount: 0,
      online: false,
      type: "dm"
    }
  ])

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      message,
      isOwn: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: undefined
    }
    setMessages([...messages, newMessage])
  }

  const activeRoomData = rooms.find(r => r.id === activeRoom)
  const [onlineCount, setOnlineCount] = React.useState(5)

  React.useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 10) + 1)
  }, [activeRoom])

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={setActiveRoom}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="ml-3 font-semibold">Chat</span>
        </div>
        
        <ChatHeader
          roomName={activeRoomData?.name || "Chat"}
          onlineCount={onlineCount}
        />
        
        <MessageList messages={messages} />
        
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
