'use client'

import { useAiControllerNutritionalFactsV1 } from '@repo/codegen/ai'
import { type NutritionalFactsResponseServingUnit } from '@repo/codegen/model'
import { SelectLabel, TextButton, TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import {
  measurementUnitsAbbreviated,
  measurementUnitsPlural,
} from '@src/utils/measurements'
import { type ChangeEvent } from 'react'
import { NutritionalFactsInput } from '../NutritionalFactsInput'

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

  function handleOnServingUnitChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    if (event.target.value) {
      setPartialNutritionalFacts({
        servingUnit: event.target.value as NutritionalFactsResponseServingUnit,
      })
    } else {
      setPartialNutritionalFacts({
        servingUnit: null,
      })
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-10">Nutritional Facts</h1>
      <TextButton
        className="mb-5"
        text="auto generate facts"
        onClick={handleOnAutoGenerate}
      />
      <SelectLabel
        label="serving unit"
        id="serving-unit"
        isRequired={false}
        options={Object.keys(measurementUnitsPlural).map((u) => {
          return {
            label:
              measurementUnitsPlural[u as keyof typeof measurementUnitsPlural],
            value: u,
          }
        })}
        onChange={handleOnServingUnitChange}
      />
      <TextLabel
        name="servingAmount"
        isRequired={false}
        label={`serving size ${nutritionalFacts?.servingUnit ? `(${measurementUnitsAbbreviated[nutritionalFacts.servingUnit]})` : ''}`}
        type="number"
        dir="rtl"
        onChange={(e) => handleOnChange('servingAmount', e)}
        value={nutritionalFacts?.servingAmount?.toString() ?? ''}
      />
      <TextLabel
        className="mb-5"
        name="servings"
        isRequired={false}
        label="total servings"
        type="number"
        dir="rtl"
        onChange={(e) => handleOnChange('servings', e)}
        value={nutritionalFacts?.servings?.toString() ?? ''}
      />
      <NutritionalFactsInput
        nutritionalFacts={nutritionalFacts}
        onNutritionalFactChange={(data) => setPartialNutritionalFacts(data)}
      />
    </section>
  )
}
