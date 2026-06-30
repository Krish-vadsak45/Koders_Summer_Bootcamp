'use client'

import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { ColorPicker } from 'primereact/colorpicker'
import { createHabit } from '@/lib/habitUtils'
import { Habit } from '@/types/habit'

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

const ICONS = [
  { label: 'Running', value: 'pi pi-bolt' },
  { label: 'Book', value: 'pi pi-book' },
  { label: 'Dumbbell', value: 'pi pi-star' },
  { label: 'Meditation', value: 'pi pi-compass' },
  { label: 'Water', value: 'pi pi-water' },
  { label: 'Code', value: 'pi pi-code' },
  { label: 'Heart', value: 'pi pi-heart' },
  { label: 'Music', value: 'pi pi-music' },
  { label: 'Smile', value: 'pi pi-smile' },
  { label: 'Check', value: 'pi pi-check' },
]

interface HabitFormProps {
  visible: boolean
  onHide: () => void
  onAddHabit: (habit: Habit) => void
}

export default function HabitForm({
  visible,
  onHide,
  onAddHabit,
}: HabitFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [color, setColor] = useState('#3B82F6')
  const [icon, setIcon] = useState('pi pi-check')

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a habit name')
      return
    }

    const newHabit = createHabit(name, description, frequency, color, icon)
    onAddHabit(newHabit)

    setName('')
    setDescription('')
    setFrequency('daily')
    setColor('#3B82F6')
    setIcon('pi pi-check')
    onHide()
  }

  return (
    <Dialog
      header="Create New Habit"
      visible={visible}
      onHide={onHide}
      modal
      style={{ width: '90vw', maxWidth: '500px' }}
    >
      <div className="space-y-4 py-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">Habit Name</label>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter habit name"
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Description</label>
          <InputTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold">Frequency</label>
            <Dropdown
              value={frequency}
              onChange={(e) => setFrequency(e.value)}
              options={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Icon</label>
            <Dropdown
              value={icon}
              onChange={(e) => setIcon(e.value)}
              options={ICONS}
              className="w-full"
              itemTemplate={(option) => (
                <div className="flex items-center gap-2">
                  <i className={`${option.value} text-lg`}></i>
                  <span>{option.label}</span>
                </div>
              )}
              valueTemplate={(option) => (
                option && (
                  <div className="flex items-center gap-2">
                    <i className={`${option} text-lg`}></i>
                  </div>
                )
              )}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-10 w-10 rounded-lg transition-all ${
                  color === c ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            label="Cancel"
            severity="secondary"
            onClick={onHide}
            className="w-20"
          />
          <Button
            label="Create"
            onClick={handleSubmit}
            className="w-20"
          />
        </div>
      </div>
    </Dialog>
  )
}
