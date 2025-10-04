'use client'

import { useAiControllerNutritionalFactsV1 } from '@repo/codegen/ai'
import { type NutritionalFactsEntity } from '@repo/codegen/model'
import { mergeCss, TextButton, TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import {
  getNameAndUnit,
  nutritionalFactsWithoutServingsConst,
} from '@src/utils/nutritionalFacts'
import { type ChangeEvent, Fragment } from 'react'

export const NutritionalFacts = () => {
  const {
    nutritionalFacts,
    setNutritionalFacts,
    setPartialNutritionalFacts,
    makeGenerateNutritionalFactsDto,
  } = useRecipeStore((state) => state)
  const { mutate } = useAiControllerNutritionalFactsV1({
    mutation: { retry: false },
  })

  const handleOnAutoGenerate = () => {
    mutate(
      { data: makeGenerateNutritionalFactsDto() },
      {
        onSuccess: (data) => {
          setNutritionalFacts(data)
        },
      },
    )
  }

  function handleOnChange(
    field: string,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    setPartialNutritionalFacts({ [field]: parseInt(event.target.value) })
  }

  return (
    <div className={mergeCss('', {})}>
      <h1 className="text-3xl font-bold mb-10">Nutritional Facts</h1>
      <TextButton
        className="mb-5"
        text="auto generate facts"
        onClick={handleOnAutoGenerate}
      />
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
                  nf as keyof NutritionalFactsEntity
                ]?.toString() ?? ''
              }
            />
          </Fragment>
        )
      })}
    </div>
  )
}
