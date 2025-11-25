'use client'

import { type NutritionalFactsResponse } from '@repo/codegen/model'
import { TextLabel } from '@repo/design-system'
import {
  getNameAndUnit,
  nutritionalFactsConst,
} from '@src/utils/nutritionalFacts'
import { Fragment } from 'react'

interface INutritionalFactsInputProps {
  nutritionalFacts: NutritionalFactsResponse | null
  onNutritionalFactChange: (
    _updatedNutritionalFacts: Partial<NutritionalFactsResponse>,
  ) => void
}
export const NutritionalFactsInput = (props: INutritionalFactsInputProps) => {
  const handleNutritionalFactChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    nf: string,
  ) => {
    const value =
      event.target.value !== '' ? parseInt(event.target.value) : null
    props.onNutritionalFactChange({
      [nf]: value,
    })
  }

  return (
    <>
      {Object.keys(nutritionalFactsConst).map((nf) => {
        const [name, unit] = getNameAndUnit(nf)
        return (
          <Fragment key={nf}>
            <TextLabel
              name={nf}
              isRequired={false}
              label={`${name} (${unit})`}
              type="number"
              dir="rtl"
              onChange={(e) => handleNutritionalFactChange(e, nf)}
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
