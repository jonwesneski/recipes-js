'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import {
  measurementUnitsAbbreviated,
  type AllMeasurements,
} from '@src/utils/measurements'
import { useEffect, useRef, type CSSProperties } from 'react'

interface IIngredientsMeasurementPopUpProps {
  top: number
  left: number
  onClick: (_value: AllMeasurements) => void
  onBlur: () => void
  className?: ClassValue
  style?: CSSProperties
}
export const IngredientsMeasurementPopUp = (
  props: IIngredientsMeasurementPopUpProps,
) => {
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
      <div className="grid grid-cols-4 gap-3">
        {Object.keys(measurementUnitsAbbreviated).map((m) => {
          return (
            <div
              key={m}
              className="border px-1 bg-text text-background hover:underline"
              role="button"
              tabIndex={0}
              onClick={() => props.onClick(m as AllMeasurements)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  props.onClick(m as AllMeasurements)
                }
              }}
            >
              {measurementUnitsAbbreviated[m as AllMeasurements]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
