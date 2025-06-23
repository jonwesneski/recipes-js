'use client'
import type { StepEntity } from '@repo/recipes-codegen/models'
import { useUserStore } from '@src/providers/use-store-provider'
import { numberToFraction } from '@src/utils/measurements'

interface RecipeIngredientsOverviewProps {
  steps: StepEntity[]
}

type UniqueIngredientsType = Record<
  string,
  {
    amount: number
    unit: string
  }
>

const createUniqueIngredient = (steps: StepEntity[]): UniqueIngredientsType => {
  const uniqueIngredients: UniqueIngredientsType = {}
  steps.forEach((step) => {
    step.ingredients.forEach((ingredient) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- not true
      if (!uniqueIngredients[ingredient.name]) {
        uniqueIngredients[ingredient.name] = {
          amount: ingredient.amount,
          unit: ingredient.unit,
        }
      } else {
        uniqueIngredients[ingredient.name].amount += ingredient.amount
      }
    })
  })
  return uniqueIngredients
}

export const RecipeIngredientsOverview = (
  props: RecipeIngredientsOverviewProps,
) => {
  const uniqueIngredients = createUniqueIngredient(props.steps)
  const useFractions = useUserStore((state) => state.useFractions)

  return (
    <ul className="recipe-ingredients-overview">
      {Object.keys(uniqueIngredients).map((name, idx) => (
        <li key={idx} style={{ listStyleType: 'none' }}>
          {`${useFractions ? numberToFraction(uniqueIngredients[name].amount) : uniqueIngredients[name].amount} ${uniqueIngredients[name].unit} ${name}`}
        </li>
      ))}
    </ul>
  )
}
