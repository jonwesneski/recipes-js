import { type IngredientEntityUnit } from '@repo/recipes-codegen/model'
import { measurementUnitsAbbreviated } from '@src/utils/measurements'
import React from 'react'

interface IngredientsMeasurementPopUpProps {
  top: number
  left: number
}
export const IngredientsMeasurementPopUp = (
  props: IngredientsMeasurementPopUpProps,
) => {
  return (
    <div
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
            <React.Fragment key={m}>
              <div className="bg-green-300 hover:bg-amber-300">
                {measurementUnitsAbbreviated[m as IngredientEntityUnit]}
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
