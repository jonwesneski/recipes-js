'use client'

import {
  measurementUnitsAbbreviated,
  type MeasurementUnitType,
} from '@src/utils/measurements'

interface IIngredientsMeasurementPopUpProps {
  onClick: (_value: MeasurementUnitType) => void
}
export const IngredientsMeasurementPopUp = (
  props: IIngredientsMeasurementPopUpProps,
) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.keys(measurementUnitsAbbreviated).map((m) => {
        return (
          <div
            key={m}
            className="border px-1 bg-text text-background hover:underline"
            role="button"
            tabIndex={0}
            onClick={() => props.onClick(m as MeasurementUnitType)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                props.onClick(m as MeasurementUnitType)
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
