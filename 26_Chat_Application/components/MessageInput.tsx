import * as React from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Send } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [input, setInput] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={disabled || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
