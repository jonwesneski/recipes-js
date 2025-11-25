'use client'

import { useAiControllerNutritionalFactsV1 } from '@repo/codegen/ai'
import type { RecipeResponseServingUnit } from '@repo/codegen/model'
import { SelectLabel, TextButton, TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import {
  measurementUnitsAbbreviated,
  measurementUnitsPlural,
} from '@src/utils/measurements'
import { type ChangeEvent } from 'react'
import { NutritionalFactsInput } from '../NutritionalFactsInput'

export const ServingsAndNutritionalFacts = () => {
  const {
    nutritionalFacts,
    setNutritionalFacts,
    setPartialNutritionalFacts,
    servingUnit,
    setServingUnit,
    servingAmount,
    setServingAmount,
    servings,
    setServings,
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

  const handleOnServingAmountChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value) {
      setServingAmount(parseInt(event.target.value))
    } else {
      setServingAmount(null)
    }
  }

  const handleOnServingUnitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      setServingUnit(event.target.value as RecipeResponseServingUnit)
    } else {
      setServingUnit(null)
    }
  }

  const handleOnServingsChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setServings(parseInt(event.target.value))
    } else {
      setServings(null)
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-10">Servings & Nutritional Facts</h1>
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
        label={`serving size ${servingUnit ? `(${measurementUnitsAbbreviated[servingUnit]})` : ''}`}
        type="number"
        dir="rtl"
        onChange={handleOnServingAmountChange}
        value={servingAmount?.toString() ?? ''}
      />
      <TextLabel
        className="mb-5"
        name="servings"
        isRequired={false}
        label="total servings"
        type="number"
        dir="rtl"
        onChange={handleOnServingsChange}
        value={servings?.toString() ?? ''}
      />
      <NutritionalFactsInput
        nutritionalFacts={nutritionalFacts}
        onNutritionalFactChange={(data) => setPartialNutritionalFacts(data)}
      />
    </section>
  )
}
