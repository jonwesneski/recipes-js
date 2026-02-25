'use client'
import { type ClassValue, mergeCss } from '@repo/design-system'
import { type CSSProperties, useEffect, useRef } from 'react'
import { IngredientAmountDropdown } from './IngredientAmountDropdown'
import { IngredientMeasurementDropdown } from './IngredientMeasurementDropdown'
import { IngredientNameDropdown } from './IngredientNameDropdown'
import { useIngredientRow } from './IngredientRowProvider'

export const dropDownModes = ['amount', 'measurement', 'name'] as const
export type DropdownMode = (typeof dropDownModes)[number]

const transformMap: Record<DropdownMode, string> = {
  amount: 'translateX(0)',
  measurement: 'translateX(calc(-100% - 10px))',
  name: 'translateX(calc(-200% - 20px))',
}

interface IngredientDropdownProps {
  top?: number
  left?: number
  className?: ClassValue
  style?: CSSProperties
}
export const IngredientDropdown = (props: IngredientDropdownProps) => {
  const { dropdownMode, onBlur, onModeChange } = useIngredientRow()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onBlur()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const moveIndex = (index: number) => {
    if (!dropdownMode) return
    const currentIndex = dropDownModes.indexOf(dropdownMode)
    const newIndex =
      (currentIndex + index + dropDownModes.length) % dropDownModes.length
    onModeChange(dropDownModes[newIndex])
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
          transform: dropdownMode
            ? transformMap[dropdownMode]
            : transformMap.amount,
          transition: 'transform 300ms ease-in-out',
          gap: '10px',
        }}
      >
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientAmountDropdown />
        </div>
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientMeasurementDropdown />
        </div>
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientNameDropdown />
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
