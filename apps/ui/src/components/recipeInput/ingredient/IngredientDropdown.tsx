'use client'
import { type ClassValue, mergeCss } from '@repo/design-system'
import { type MeasurementUnitType } from '@src/utils/measurements'
import { type CSSProperties, useEffect, useRef } from 'react'
import { IngredientAmountDropdown } from './IngredientAmountDropdown'
import { IngredientMeasurementDropdown } from './IngredientMeasurementDropdown'
import { IngredientNameDropdown } from './IngredientNameDropdown'

export const dropDownModes = ['amount', 'measurement', 'name'] as const
export type DropdownMode = (typeof dropDownModes)[number]

const transformMap: Record<DropdownMode, string> = {
  amount: 'translateX(0)',
  measurement: 'translateX(calc(-100% - 10px))',
  name: 'translateX(calc(-200% - 20px))',
}

interface IngredientDropdownProps {
  mode: DropdownMode
  amountValue: string
  nameValue: string
  caretIndex: number
  top?: number
  left?: number
  onAmountChange: (_value: string, _newCaretIndex: number) => void
  onMeasurementChange: (_value: MeasurementUnitType) => void
  onNameClick: (_value: string) => void
  onBlur: () => void
  onModeChange: (_mode: DropdownMode) => void
  className?: ClassValue
  style?: CSSProperties
}
export const IngredientDropdown = (props: IngredientDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        props.onBlur()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const moveIndex = (index: number) => {
    const currentIndex = dropDownModes.indexOf(props.mode)
    const newIndex =
      (currentIndex + index + dropDownModes.length) % dropDownModes.length
    props.onModeChange(dropDownModes[newIndex])
  }

  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        position: 'absolute',
        top: props.top,
        left: props.left,
        padding: '10px',
        zIndex: 1000,
        overflow: 'hidden',
      }}
      className={mergeCss('border', props.className)}
    >
      <div
        style={{
          display: 'flex',
          transform: transformMap[props.mode],
          transition: 'transform 300ms ease-in-out',
          gap: '10px',
        }}
      >
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientAmountDropdown
            value={props.amountValue}
            caretIndex={props.caretIndex}
            onChange={props.onAmountChange}
          />
        </div>
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientMeasurementDropdown onClick={props.onMeasurementChange} />
        </div>
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientNameDropdown
            value={props.nameValue}
            onClick={props.onNameClick}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          className="block flex-1 bg-text text-background"
          type="button"
          onClick={() => moveIndex(-1)}
        >
          &lt;
        </button>
        <button
          className="block flex-1 bg-text text-background"
          type="button"
          onClick={() => moveIndex(1)}
        >
          &gt;
        </button>
      </div>
    </div>
  )
}
