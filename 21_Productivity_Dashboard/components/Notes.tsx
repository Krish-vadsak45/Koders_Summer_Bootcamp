"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Trash2, Edit, Save, X } from "lucide-react"
import { toast } from "sonner"
import { storage } from "@/lib/storage"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Note {
  id: string
  content: string
  timestamp: number
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")

  useEffect(() => {
    const savedNotes = storage.get("notes")
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes)
    storage.set("notes", updatedNotes)
  }

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast.error("Please enter a note")
      return
    }

    const newNote: Note = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      timestamp: Date.now(),
    }

    saveNotes([newNote, ...notes])
    setNewNoteContent("")
    toast.success("Note created successfully")
  }

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    saveNotes(updatedNotes)
    toast.success("Note deleted")
  }

  const handleEditNote = (note: Note) => {
    setEditingId(note.id)
    setEditingContent(note.content)
  }

  const handleSaveEdit = () => {
    if (!editingContent.trim()) {
      toast.error("Note cannot be empty")
      return
    }

    const updatedNotes = notes.map((note) =>
      note.id === editingId
        ? { ...note, content: editingContent.trim(), timestamp: Date.now() }
        : note
    )
    saveNotes(updatedNotes)
    setEditingId(null)
    setEditingContent("")
    toast.success("Note updated successfully")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingContent("")
  }

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-2 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Notes
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddNote()}
            className="flex-1"
          />
          <Button onClick={handleAddNote} size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 max-h-96">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? "No notes found" : "No notes yet. Add your first note!"}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-muted rounded-lg border hover:border-primary transition-colors"
              >
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="icon"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        variant="default"
                        size="icon"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(note.timestamp)}</span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditNote(note)}
                          variant="ghost"
                          size="icon"
                          title="Edit note"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteNote(note.id)}
                          variant="ghost"
                          size="icon"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
