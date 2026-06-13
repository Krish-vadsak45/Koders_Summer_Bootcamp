'use client'

import { DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BillInputProps {
  value: number
  onChange: (value: number) => void
}

/**
 * BillInput - Input field for bill amount
 * Handles numeric input and validation
 */
export function BillInput({ value, onChange }: BillInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '' || inputValue === '.') {
      onChange(0)
      return
    }

    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="bill-amount" className="text-sm font-medium">
        Bill Amount
      </Label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          id="bill-amount"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={value || ''}
          onChange={handleChange}
          className="pl-10 text-lg font-semibold"
          step="0.01"
          min="0"
        />
      </div>
    </div>
  )
}
