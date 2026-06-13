'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TipPercentageSelectorProps {
  selectedPercent: number
  customPercent: string
  onSelectPercent: (percent: number) => void
  onCustomPercentChange: (percent: string) => void
}

/**
 * TipPercentageSelector - Allows selection of preset tip percentages or custom input
 * Presets: 10%, 15%, 20%, 25%
 */
export function TipPercentageSelector({
  selectedPercent,
  customPercent,
  onSelectPercent,
  onCustomPercentChange,
}: TipPercentageSelectorProps) {
  const presets = [
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 },
    { label: '25%', value: 25 },
  ]

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onCustomPercentChange(value)
    }
  }

  const handlePresetClick = (value: number) => {
    onSelectPercent(value)
    onCustomPercentChange('') // Clear custom input when selecting preset
  }

  const isCustomActive = customPercent !== ''

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tip Percentage</Label>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            variant={
              !isCustomActive && selectedPercent === preset.value
                ? 'default'
                : 'outline'
            }
            size="sm"
            className="text-sm font-medium"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="pt-2">
        <Label htmlFor="custom-tip" className="text-xs text-muted-foreground mb-2 block">
          Custom Percentage
        </Label>
        <div className="relative">
          <Input
            id="custom-tip"
            type="number"
            inputMode="decimal"
            placeholder="Enter custom %"
            value={customPercent}
            onChange={handleCustomChange}
            className="pr-8"
            step="0.01"
            min="0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            %
          </span>
        </div>
      </div>
    </div>
  )
}
