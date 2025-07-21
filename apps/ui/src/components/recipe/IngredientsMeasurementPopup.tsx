'use client'

import { type IngredientEntityUnit } from '@repo/codegen/model'
import { measurementUnitsAbbreviated } from '@src/utils/measurements'
import { useEffect, useRef } from 'react'

interface IngredientsMeasurementPopUpProps {
  top: number
  left: number
  onClick: (value: IngredientEntityUnit) => void
  onBlur: () => void
}
export const IngredientsMeasurementPopUp = (
  props: IngredientsMeasurementPopUpProps,
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
        position: 'absolute',
        top: props.top,
        left: props.left,
        backgroundColor: 'white',
        border: '1px solid black',
        padding: '10px',
        zIndex: 1000,
      }}
    >
      <div className="grid grid-cols-4 gap-3">
        {Object.keys(measurementUnitsAbbreviated).map((m) => {
          return (
            <div
              key={m}
              className="bg-green-300 hover:bg-amber-300"
              onClick={() => props.onClick(m as IngredientEntityUnit)}
            >
              {measurementUnitsAbbreviated[m as IngredientEntityUnit]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
