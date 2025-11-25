'use client'

import { type NutritionalFactsResponse } from '@repo/codegen/model'
import { TextLabel } from '@repo/design-system'
import {
  getNameAndUnit,
  nutritionalFactsWithoutServingsConst,
} from '@src/utils/nutritionalFacts'
import { Fragment } from 'react'

interface INutritionalFactsInputProps {
  nutritionalFacts?: NutritionalFactsResponse
  onNutritionalFactChange: (
    _updatedNutritionalFacts: Partial<NutritionalFactsResponse>,
  ) => void
}
export const NutritionalFactsInput = (props: INutritionalFactsInputProps) => {
  return (
    <>
      {Object.keys(nutritionalFactsWithoutServingsConst).map((nf) => {
        const [name, unit] = getNameAndUnit(nf)
        return (
          <Fragment key={nf}>
            <TextLabel
              name={nf}
              isRequired={false}
              label={`${name} (${unit})`}
              type="number"
              dir="rtl"
              onChange={(e) =>
                props.onNutritionalFactChange({
                  [nf]: parseInt(e.target.value),
                })
              }
              value={
                props.nutritionalFacts?.[
                  nf as keyof NutritionalFactsResponse
                ]?.toString() ?? ''
              }
            />
          </Fragment>
        )
      })}
    </>
  )
}
