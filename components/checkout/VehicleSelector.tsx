'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Field, inputBase, selectClass, selectChevronStyle, fieldBorder } from '@/components/ui/Field'
import { MAKE_NAMES, modelsForMake, CAR_YEARS } from '@/lib/cars'

const CUSTOM = 'Custom'

interface VehicleSelectorProps {
  idPrefix: string
  make: string
  model: string
  year: string
  errors: { carMake?: string; carModel?: string; carYear?: string }
  onChange: (patch: { carMake?: string; carModel?: string; carYear?: string }) => void
}

export function VehicleSelector({
  idPrefix,
  make,
  model,
  year,
  errors,
  onChange,
}: VehicleSelectorProps) {
  // Track "Custom" mode explicitly: selecting Custom clears the value to '',
  // which is otherwise indistinguishable from "nothing selected", so we can't
  // infer it from the value alone. We still fall back to value-based detection
  // so a pre-filled custom value (e.g. restored state) shows the text input.
  const [customMakeMode, setCustomMakeMode] = useState(false)
  const [customModelMode, setCustomModelMode] = useState(false)

  const makeOptions = useMemo(() => [...MAKE_NAMES, CUSTOM], [])
  const isCustomMake = customMakeMode || (!!make && !MAKE_NAMES.includes(make))
  const availableModels = useMemo(
    () => (isCustomMake ? [] : modelsForMake(make)),
    [isCustomMake, make],
  )
  const showModelDropdown = !isCustomMake && availableModels.length > 0
  const modelOptions = showModelDropdown ? [...availableModels, CUSTOM] : []
  const isCustomModel =
    customModelMode || (showModelDropdown && !!model && !availableModels.includes(model))

  const id = (k: string) => `${idPrefix}-${k}`

  const setMake = (next: string) => {
    setCustomModelMode(false)
    if (next === CUSTOM) {
      setCustomMakeMode(true)
      onChange({ carMake: '', carModel: '' })
    } else {
      setCustomMakeMode(false)
      onChange({ carMake: next, carModel: '' })
    }
  }

  const setModel = (next: string) => {
    if (next === CUSTOM) {
      setCustomModelMode(true)
      onChange({ carModel: '' })
    } else {
      setCustomModelMode(false)
      onChange({ carModel: next })
    }
  }

  // The select value should reflect whether we're in "custom" mode.
  const makeSelectValue = isCustomMake ? CUSTOM : make
  const modelSelectValue = isCustomModel ? CUSTOM : model

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field id={id('carMake')} label="Car make" required error={errors.carMake}>
        <select
          id={id('carMake')}
          value={makeSelectValue}
          onChange={(e) => setMake(e.target.value)}
          className={cn(selectClass, fieldBorder(errors.carMake))}
          style={selectChevronStyle}
        >
          <option value="">Select brand</option>
          {makeOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {isCustomMake && (
          <input
            id={`${id('carMake')}-custom`}
            type="text"
            placeholder="Enter make"
            value={make}
            onChange={(e) => onChange({ carMake: e.target.value })}
            className={cn(inputBase, 'mt-2', fieldBorder(errors.carMake))}
            autoComplete="off"
          />
        )}
      </Field>

      <Field id={id('carModel')} label="Model" required error={errors.carModel}>
        {showModelDropdown ? (
          <select
            id={id('carModel')}
            value={modelSelectValue}
            onChange={(e) => setModel(e.target.value)}
            className={cn(selectClass, fieldBorder(errors.carModel))}
            style={selectChevronStyle}
            disabled={!make}
          >
            <option value="">Select model</option>
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id('carModel')}
            type="text"
            placeholder={make ? 'Enter model' : 'Pick a brand first'}
            value={model}
            onChange={(e) => onChange({ carModel: e.target.value })}
            className={cn(inputBase, fieldBorder(errors.carModel))}
            disabled={!make && !isCustomMake}
            autoComplete="off"
          />
        )}
        {showModelDropdown && isCustomModel && (
          <input
            type="text"
            placeholder="Enter model"
            value={model}
            onChange={(e) => onChange({ carModel: e.target.value })}
            className={cn(inputBase, 'mt-2', fieldBorder(errors.carModel))}
            autoComplete="off"
          />
        )}
      </Field>

      <Field id={id('carYear')} label="Year" required error={errors.carYear}>
        <select
          id={id('carYear')}
          value={year}
          onChange={(e) => onChange({ carYear: e.target.value })}
          className={cn(selectClass, fieldBorder(errors.carYear))}
          style={selectChevronStyle}
        >
          <option value="">Select year</option>
          {CAR_YEARS.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </Field>
    </div>
  )
}
