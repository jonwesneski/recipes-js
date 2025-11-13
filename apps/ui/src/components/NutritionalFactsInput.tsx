'use client'

import { type NutritionalFactsResponse } from '@repo/codegen/model'
import { TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import {
  getNameAndUnit,
  nutritionalFactsWithoutServingsConst,
} from '@src/utils/nutritionalFacts'
import { Fragment, type ChangeEvent } from 'react'

export const NutritionalFactsInput = () => {
  const { nutritionalFacts, setPartialNutritionalFacts } = useRecipeStore(
    (state) => state,
  )

  function handleOnChange(
    field: string,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    setPartialNutritionalFacts({ [field]: parseInt(event.target.value) })
  }

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
              onChange={(e) => handleOnChange(nf, e)}
              value={
                nutritionalFacts?.[
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
