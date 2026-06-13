'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface RoundingOptionsProps {
  roundingMode: 'none' | 'normal' | 'up'
  onChange: (mode: 'none' | 'normal' | 'up') => void
}

/**
 * RoundingOptions - Select how to round the final amounts
 * Modes:
 * - none: No rounding (standard rounding to 2 decimals)
 * - normal: Standard mathematical rounding
 * - up: Always round up (ceiling)
 */
export function RoundingOptions({
  roundingMode,
  onChange,
}: RoundingOptionsProps) {
  const options = [
    { id: 'none', label: 'No Rounding', description: 'Full precision' },
    { id: 'normal', label: 'Normal', description: 'Standard rounding' },
    { id: 'up', label: 'Round Up', description: 'Always round up' },
  ] as const

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Rounding Mode</Label>

      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            onClick={() => onChange(option.id)}
            variant={roundingMode === option.id ? 'default' : 'outline'}
            size="sm"
            className="h-auto py-2 flex flex-col gap-0.5 text-center"
          >
            <span className="text-xs font-medium leading-tight">
              {option.label}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              {option.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
