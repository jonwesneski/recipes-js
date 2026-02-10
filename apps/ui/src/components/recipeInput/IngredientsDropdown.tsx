'use client'
import { type ClassValue, mergeCss } from '@repo/design-system'
import { MeasurementUnitType } from '@src/utils/measurements'
import { type CSSProperties, useEffect, useRef } from 'react'
import { IngredientsAmountDropdown } from './IngredientsAmountDropdown'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

export type DropdownMode = 'amount' | 'measurement' | null

interface IngredientsDropdownProps {
  mode: DropdownMode
  value: string
  top?: number
  left?: number
  onAmountChange: (_value: string) => void
  onMeasurementChange: (_value: MeasurementUnitType) => void
  onBlur: () => void
  className?: ClassValue
  style?: CSSProperties
}
export const IngredientsDropdown = (props: IngredientsDropdownProps) => {
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
          transform:
            props.mode === 'measurement'
              ? 'translateX(-100%)'
              : 'translateX(0)',
          transition: 'transform 300ms ease-in-out',
        }}
      >
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientsAmountDropdown
            value={props.value}
            onChange={props.onAmountChange}
          />
        </div>
        <div style={{ minWidth: '100%', flexShrink: 0 }}>
          <IngredientsMeasurementPopUp onClick={props.onMeasurementChange} />
        </div>
      </div>
    </div>
  )
}
