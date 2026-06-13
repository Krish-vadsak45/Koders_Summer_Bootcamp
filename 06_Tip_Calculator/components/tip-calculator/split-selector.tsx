'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Minus, Plus } from 'lucide-react'

interface SplitSelectorProps {
  numberOfPeople: number
  onChange: (count: number) => void
}

/**
 * SplitSelector - Control number of people to split the bill
 * Includes increment/decrement buttons and direct input
 */
export function SplitSelector({ numberOfPeople, onChange }: SplitSelectorProps) {
  const handleIncrement = () => {
    onChange(numberOfPeople + 1)
  }

  const handleDecrement = () => {
    if (numberOfPeople > 1) {
      onChange(numberOfPeople - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') return

    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 99) {
      onChange(numValue)
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Split Between</Label>

      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <Button
          onClick={handleDecrement}
          variant="outline"
          size="icon"
          className="h-10 w-10"
          disabled={numberOfPeople <= 1}
          aria-label="Decrease number of people"
        >
          <Minus className="h-4 w-4" />
        </Button>

        {/* Input Field */}
        <Input
          type="number"
          inputMode="numeric"
          value={numberOfPeople}
          onChange={handleInputChange}
          className="text-center font-semibold text-lg"
          min="1"
          max="99"
          aria-label="Number of people"
        />

        {/* People Label */}
        <div className="flex-1 text-sm text-muted-foreground text-center">
          {numberOfPeople === 1 ? 'Person' : 'People'}
        </div>

        {/* Increment Button */}
        <Button
          onClick={handleIncrement}
          variant="outline"
          size="icon"
          className="h-10 w-10"
          disabled={numberOfPeople >= 99}
          aria-label="Increase number of people"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
