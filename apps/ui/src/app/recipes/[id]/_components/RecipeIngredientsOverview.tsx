'use client'

import type { MeasurementFormat } from '@repo/codegen/model'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import {
  determineAmountFormat,
  determineUsersAmountUnit,
} from '@src/utils/measurements'
import type { NormalizedRecipe } from '@src/zod-schemas/recipeNormalized'
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
  ingredients: NormalizedRecipe['ingredients'],
  measurementFormat: MeasurementFormat,
): UniqueIngredientsType => {
  const uniqueIngredients: UniqueIngredientsType = {}
  Object.values(ingredients).forEach((ing) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- not true
    if (uniqueIngredients[ing.dto.name]) {
      uniqueIngredients[ing.dto.name] = {
        ...determineUsersAmountUnit(
          ing.dto.amount,
          ing.dto.unit,
          measurementFormat,
        ),
        isFraction: ing.dto.isFraction,
      }
    } else {
      uniqueIngredients[ing.dto.name].amount += determineUsersAmountUnit(
        ing.dto.amount,
        ing.dto.unit,
        measurementFormat,
      ).amount
    }
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
  const {
    ingredients,
    metadata: { scaleFactor },
  } = useRecipeStore((state) => state)
  const { numberFormat, measurementFormat } = useUserStore()
  const uniqueIngredients = createUniqueIngredient(
    ingredients,
    measurementFormat,
  )

  return (
    <div {...props}>
      <h2 className="font-semibold">total ingredients:</h2>
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
