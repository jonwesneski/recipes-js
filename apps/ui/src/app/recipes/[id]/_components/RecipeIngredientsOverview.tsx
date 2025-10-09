'use client'

import type { MeasurementFormat } from '@repo/codegen/model'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import { type StepItemType } from '@src/stores/recipe-store'
import {
  determineAmountFormat,
  determineAmountUnit,
} from '@src/utils/measurements'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type UniqueIngredientsType = Record<
  string,
  {
    amount: number
    isFraction: boolean
    unit: string | null
  }
>

const createUniqueIngredient = (
  steps: StepItemType[],
  measurementFormat: MeasurementFormat,
): UniqueIngredientsType => {
  const uniqueIngredients: UniqueIngredientsType = {}
  steps.forEach((step) => {
    step.ingredients.items.forEach((i) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- not true
      if (!uniqueIngredients[i.ingredient.dto.name]) {
        uniqueIngredients[i.ingredient.dto.name] = {
          ...determineAmountUnit(
            i.ingredient.dto.amount,
            i.ingredient.dto.unit,
            measurementFormat,
          ),
          isFraction: i.ingredient.dto.isFraction,
        }
      } else {
        uniqueIngredients[i.ingredient.dto.name].amount += determineAmountUnit(
          i.ingredient.dto.amount,
          i.ingredient.dto.unit,
          measurementFormat,
        ).amount
      }
    })
  })
  return uniqueIngredients
}

export type RecipeIngredientsOverviewProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'style'
>
export const RecipeIngredientsOverview = (
  props: RecipeIngredientsOverviewProps,
) => {
  const { steps, scaleFactor } = useRecipeStore((state) => state)
  const { numberFormat, measurementFormat } = useUserStore((state) => state)
  const uniqueIngredients = createUniqueIngredient(steps, measurementFormat)

  return (
    <div {...props}>
      <h1 className="font-semibold">total ingredients:</h1>
      <ul className="ml-2">
        {Object.keys(uniqueIngredients).map((name) => (
          <li key={name} style={{ listStyleType: 'none' }}>
            {`${determineAmountFormat(
              uniqueIngredients[name].amount,
              scaleFactor,
              uniqueIngredients[name].isFraction,
              numberFormat,
            )}${uniqueIngredients[name].unit ? ` ${uniqueIngredients[name].unit} ` : ' '}${name}`}
          </li>
        ))}
      </ul>
    </div>
  )
}
