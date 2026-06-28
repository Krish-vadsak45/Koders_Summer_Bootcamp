"use client"

import { useState, useEffect, useCallback } from "react"
import { Calculator as CalculatorIcon, Copy, Delete, History, Percent, Square } from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HistoryItem {
  expression: string
  result: string
}

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isScientific, setIsScientific] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key)
      else if (e.key === ".") handleDecimal()
      else if (e.key === "+") handleOperation("+")
      else if (e.key === "-") handleOperation("-")
      else if (e.key === "*") handleOperation("×")
      else if (e.key === "/") handleOperation("÷")
      else if (e.key === "Enter" || e.key === "=") handleEquals()
      else if (e.key === "Escape") handleClear()
      else if (e.key === "Backspace") handleDelete()
      else if (e.key === "%") handlePercentage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [display, previousValue, operation, waitingForOperand])

  const handleDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }, [display, waitingForOperand])

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }, [display, waitingForOperand])

  const handleOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(display)
    } else if (operation) {
      const currentValue = previousValue || "0"
      const newValue = performOperation(parseFloat(currentValue), inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(String(newValue))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, previousValue, operation])

  const performOperation = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : "Error"
      case "^":
        return Math.pow(firstValue, secondValue)
      default:
        return secondValue
    }
  }

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = performOperation(parseFloat(previousValue), inputValue, operation)
      const result = String(newValue)
      setDisplay(result)
      
      // Add to history
      const expression = `${previousValue} ${operation} ${display}`
      setHistory(prev => [{ expression, result }, ...prev].slice(0, 10))
      
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }, [display, previousValue, operation])

  const handleClear = useCallback(() => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [])

  const handleDelete = useCallback(() => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0")
  }, [display])

  const handlePercentage = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])

  const handleSquareRoot = useCallback(() => {
    const value = parseFloat(display)
    if (value < 0) {
      toast.error("Cannot calculate square root of negative number")
      return
    }
    setDisplay(String(Math.sqrt(value)))
  }, [display])

  const handlePower = useCallback(() => {
    setPreviousValue(display)
    setOperation("^")
    setWaitingForOperand(true)
  }, [display])

  const handleSin = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(Math.sin(value)))
  }, [display])

  const handleCos = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(Math.cos(value)))
  }, [display])

  const handleTan = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(Math.tan(value)))
  }, [display])

  const handleLog = useCallback(() => {
    const value = parseFloat(display)
    if (value <= 0) {
      toast.error("Cannot calculate log of non-positive number")
      return
    }
    setDisplay(String(Math.log10(value)))
  }, [display])

  const handleLn = useCallback(() => {
    const value = parseFloat(display)
    if (value <= 0) {
      toast.error("Cannot calculate ln of non-positive number")
      return
    }
    setDisplay(String(Math.log(value)))
  }, [display])

  const handlePi = useCallback(() => {
    setDisplay(String(Math.PI))
  }, [])

  const handleE = useCallback(() => {
    setDisplay(String(Math.E))
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(display)
    toast.success("Result copied to clipboard")
  }, [display])

  const handleHistoryClick = useCallback((item: HistoryItem) => {
    setDisplay(item.result)
    setShowHistory(false)
    toast.success("Loaded from history")
  }, [])

interface ButtonConfig {
  label: string
  action: () => void
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "success" | "danger"
  icon?: any
  colSpan?: number
  rowSpan?: number
}

  const basicButtons: ButtonConfig[] = [
    { label: "C", action: handleClear, variant: "danger" },
    { label: "⌫", action: handleDelete, variant: "secondary", icon: Delete },
    { label: "%", action: handlePercentage, variant: "secondary", icon: Percent },
    { label: "÷", action: () => handleOperation("÷"), variant: "default" },
    { label: "7", action: () => handleDigit("7"), variant: "outline" },
    { label: "8", action: () => handleDigit("8"), variant: "outline" },
    { label: "9", action: () => handleDigit("9"), variant: "outline" },
    { label: "×", action: () => handleOperation("×"), variant: "default" },
    { label: "4", action: () => handleDigit("4"), variant: "outline" },
    { label: "5", action: () => handleDigit("5"), variant: "outline" },
    { label: "6", action: () => handleDigit("6"), variant: "outline" },
    { label: "-", action: () => handleOperation("-"), variant: "default" },
    { label: "1", action: () => handleDigit("1"), variant: "outline" },
    { label: "2", action: () => handleDigit("2"), variant: "outline" },
    { label: "3", action: () => handleDigit("3"), variant: "outline" },
    { label: "+", action: () => handleOperation("+"), variant: "default" },
    { label: "0", action: () => handleDigit("0"), variant: "outline", colSpan: 2 },
    { label: ".", action: handleDecimal, variant: "outline" },
    { label: "=", action: handleEquals, variant: "success", rowSpan: 2 },
  ]

  const scientificButtons: ButtonConfig[] = [
    { label: "sin", action: handleSin, variant: "secondary" },
    { label: "cos", action: handleCos, variant: "secondary" },
    { label: "tan", action: handleTan, variant: "secondary" },
    { label: "log", action: handleLog, variant: "secondary" },
    { label: "ln", action: handleLn, variant: "secondary" },
    { label: "π", action: handlePi, variant: "secondary" },
    { label: "e", action: handleE, variant: "secondary" },
    { label: "√", action: handleSquareRoot, variant: "secondary", icon: Square },
    { label: "x²", action: handlePower, variant: "secondary" },
  ]

  const buttons = isScientific ? [...scientificButtons, ...basicButtons] : basicButtons

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalculatorIcon className="w-6 h-6" />
            Calculator
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={isScientific ? "default" : "outline"}
              size="icon"
              onClick={() => setIsScientific(!isScientific)}
              title="Toggle scientific mode"
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant={showHistory ? "default" : "outline"}
              size="icon"
              onClick={() => setShowHistory(!showHistory)}
              title="View history"
            >
              <History className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              title="Copy result"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showHistory && history.length > 0 && (
          <div className="mb-4 p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="flex justify-between items-center py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer text-sm"
              >
                <span className="text-muted-foreground">{item.expression}</span>
                <span className="font-semibold">= {item.result}</span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-muted text-foreground p-4 rounded-xl mb-4 border-2">
          <div className="text-right text-3xl md:text-4xl font-mono font-bold truncate">
            {display}
          </div>
        </div>

        <div className={`grid gap-2 ${isScientific ? "grid-cols-5" : "grid-cols-4"}`}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.action}
              variant={button.variant}
              size={isScientific && index < scientificButtons.length ? "sm" : "lg"}
              className={`font-semibold ${button.colSpan ? `col-span-${button.colSpan}` : ""} ${button.rowSpan ? `row-span-${button.rowSpan}` : ""}`}
            >
              {button.icon ? <button.icon className="w-4 h-4" /> : button.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
