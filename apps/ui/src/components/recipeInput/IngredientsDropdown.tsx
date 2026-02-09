'use client'
import { ClassValue, mergeCss } from '@repo/design-system'
import { MeasurementUnitType } from '@src/utils/measurements'
import { CSSProperties, useEffect, useRef } from 'react'
import { IngredientsAmountDropdown } from './IngredientsAmountDropdown'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

interface IngredientsDropdownProps {
  value: string
  cursorIndex: number
  top: number
  left: number
  onAmountChange: (value: string) => void
  onMeasurementChange: (value: MeasurementUnitType) => void
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
      }}
      className={mergeCss('border', props.className)}
    >
      {props.cursorIndex === 0 ? (
        <IngredientsAmountDropdown
          value={props.value}
          onChange={() => console.log()}
        />
      ) : (
        <IngredientsMeasurementPopUp
          top={props.top}
          left={props.left}
          onClick={props.onMeasurementChange}
          onBlur={props.onBlur}
        />
      )}
    </div>
  )
}
