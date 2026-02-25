'use client'

import {
  measurementUnitsAbbreviated,
  type MeasurementUnitType,
} from '@src/utils/measurements'
import { useIngredientRow } from './IngredientRowProvider'

export const IngredientMeasurementDropdown = () => {
  const { onMeasurementChange } = useIngredientRow()

  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.keys(measurementUnitsAbbreviated).map((m) => {
        return (
          <div
            key={m}
            className="border px-1 bg-text text-background hover:underline"
            role="button"
            tabIndex={0}
            onClick={() => onMeasurementChange(m as MeasurementUnitType)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onMeasurementChange(m as MeasurementUnitType)
              }
            }}
          >
            <abbr title={m}>
              {measurementUnitsAbbreviated[m as MeasurementUnitType]}
            </abbr>
          </div>
        )
      })}
    </div>
  )
}
