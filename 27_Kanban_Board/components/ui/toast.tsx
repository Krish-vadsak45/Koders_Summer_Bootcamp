"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose?: () => void
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm shadow-lg transition-all",
        {
          "bg-green-500 text-white": type === "success",
          "bg-red-500 text-white": type === "error",
          "bg-blue-500 text-white": type === "info",
        }
      )}
    >
      {message}
    </div>
  )
}
