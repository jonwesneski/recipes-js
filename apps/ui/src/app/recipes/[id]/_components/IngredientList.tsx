'use client'

import { type ClassValue, mergeCss, useCustomModal } from '@repo/design-system'
import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import { roundToDecimal } from '@src/utils/calculate'
import {
  type MeasurementUnitType,
  determineAmountFormat,
  determineUsersAmountUnit,
} from '@src/utils/measurements'
import type { NormalizedIngredient } from '@src/zod-schemas/recipeNormalized'
import { ModalMeasurementConversions } from './ModalMeasurementConversions'

interface IngredientListProps {
  stepId: string
  scaleFactor: number
  className?: ClassValue
}
const IngredientList = (props: IngredientListProps) => {
  const { numberFormat, measurementFormat } = useUserStore()
  const { showModal } = useCustomModal()
  const { ingredientIds, ingredients } = useRecipeStepIngredientsStore(
    props.stepId,
  ) // subscribe to ingredient changes

  const handleOnShowConversions = (
    e: React.MouseEvent,
    ingredient: NormalizedIngredient['dto'],
  ) => {
    e.preventDefault()
    if (ingredient.unit !== null) {
      const blocking = true
      showModal(
        ModalMeasurementConversions.name,
        blocking,
        () => (
          <ModalMeasurementConversions
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it is not null
            unitType={ingredient.unit! as MeasurementUnitType}
            amount={roundToDecimal(ingredient.amount * props.scaleFactor, 2)}
            name={ingredient.name}
          />
        ),
        {},
      )
    }
  }

  return ingredientIds.length ? (
    <ul className={mergeCss('list-disc', props.className)}>
      {ingredientIds.map((id) => {
        const { amount, unit } = determineUsersAmountUnit(
          ingredients[id].dto.amount,
          ingredients[id].dto.unit,
          measurementFormat,
        )
        return (
          <li key={id} className="text-left">
            <span>
              {determineAmountFormat(
                amount,
                props.scaleFactor,
                ingredients[id].dto.isFraction,
                numberFormat,
              )}
            </span>{' '}
            {unit ? (
              /*eslint-disable-next-line jsx-a11y/anchor-is-valid -- for now*/
              <a
                href="#"
                className={
                  'inline-block mr-2 underline decoration-dotted underline-offset-4'
                }
                onClick={(e) => handleOnShowConversions(e, ingredients[id].dto)}
              >
                {unit}
              </a>
            ) : null}
            {ingredients[id].dto.name}
          </li>
        )
      })}
    </ul>
  ) : null
}
export default IngredientList
