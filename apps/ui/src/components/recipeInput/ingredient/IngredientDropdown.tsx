'use client'
import { type ClassValue, mergeCss } from '@repo/design-system'
import { type CSSProperties, useEffect, useRef } from 'react'
import { IngredientAmountDropdown } from './IngredientAmountDropdown'
import { IngredientMeasurementDropdown } from './IngredientMeasurementDropdown'
import { IngredientNameDropdown } from './IngredientNameDropdown'
import { useIngredientRow } from './IngredientRowProvider'

export const dropDownModes = ['amount', 'measurement', 'name'] as const
export type DropdownMode = (typeof dropDownModes)[number]

const placeholderAmounts = ['3', '2 1/2', '0.25', '1/4'] as const
const placeholderMeasurements = ['cups', 'pounds', 'liters'] as const
const placeholderNames = ['onion', 'ice cream', 'soy sauce'] as const

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

  const getDropdownModeNeighbor = (index: 1 | -1) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- when this component is rendered it shouldn't be null
    const currentIndex = dropDownModes.indexOf(dropdownMode!)
    const newIndex =
      (currentIndex + index + dropDownModes.length) % dropDownModes.length
    return dropDownModes[newIndex]
  }

  const previousMode = getDropdownModeNeighbor(-1)
  const nextMode = getDropdownModeNeighbor(1)

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
      <div className="pl-2 pb-2">
        <span className="font-bold">e.g.:</span>{' '}
        <span
          className={mergeCss('text-muted', {
            'text-text font-bold': dropdownMode === 'amount',
          })}
        >
          {
            placeholderAmounts[
              Math.floor(Math.random() * placeholderAmounts.length)
            ]
          }
        </span>{' '}
        <span
          className={mergeCss('text-muted', {
            'text-text font-bold': dropdownMode === 'measurement',
          })}
        >
          {
            placeholderMeasurements[
              Math.floor(Math.random() * placeholderMeasurements.length)
            ]
          }
        </span>{' '}
        <span
          className={mergeCss('text-muted', {
            'text-text font-bold': dropdownMode === 'name',
          })}
        >
          {
            placeholderNames[
              Math.floor(Math.random() * placeholderNames.length)
            ]
          }
        </span>
      </div>
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
          className="block flex-1 bg-text text-background text-left px-2"
          type="button"
          onClick={() => onModeChange(previousMode)}
        >
          <span className="font-bold">&lt;</span> {previousMode}
        </button>
        <button
          className="block flex-1 bg-text text-background text-right px-2"
          type="button"
          onClick={() => onModeChange(nextMode)}
        >
          {nextMode} <span className="font-bold">&gt;</span>
        </button>
      </div>
    </div>
  )
}
