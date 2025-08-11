'use client'

import { type IngredientEntityUnit } from '@repo/codegen/model'
import { measurementUnitsAbbreviated } from '@src/utils/measurements'
import { useEffect, useRef } from 'react'

interface IngredientsMeasurementPopUpProps {
  top: number
  left: number
  onClick: (_value: IngredientEntityUnit) => void
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
        padding: '10px',
        zIndex: 1000,
      }}
      className="border"
    >
      <div className="grid grid-cols-4 gap-3">
        {Object.keys(measurementUnitsAbbreviated).map((m) => {
          return (
            <div
              key={m}
              className="border px-1 bg-text text-background hover:underline"
              role="button"
              tabIndex={0}
              onClick={() => props.onClick(m as IngredientEntityUnit)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  props.onClick(m as IngredientEntityUnit)
                }
              }}
            >
              {measurementUnitsAbbreviated[m as IngredientEntityUnit]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
