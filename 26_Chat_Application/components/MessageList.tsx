import * as React from "react"
import { ScrollArea } from "./ui/scroll-area"
import MessageBubble from "./MessageBubble"

interface Message {
  id: string
  sender: string
  message: string
  isOwn: boolean
  timestamp: string
  avatar?: string
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.message}
              sender={msg.sender}
              isOwn={msg.isOwn}
              timestamp={msg.timestamp}
              avatar={msg.avatar}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
