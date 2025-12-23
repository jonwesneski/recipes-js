'use client'

import type { IngredientResponse } from '@repo/codegen/model'
import { type ClassValue, mergeCss, useCustomModal } from '@repo/design-system'
import { useUserStore } from '@src/providers/use-store-provider'
import { roundToDecimal } from '@src/utils/calculate'
import {
  type MeasurementUnitType,
  determineAmountFormat,
  determineAmountUnit,
} from '@src/utils/measurements'
import { ModalMeasurementConversions } from './ModalMeasurementConversions'

type IngredientParams = Omit<IngredientResponse, 'createdAt' | 'updatedAt'>

interface IngredientListProps {
  ingredients: IngredientParams[]
  scaleFactor: number
  className?: ClassValue
}
const IngredientList = (props: IngredientListProps) => {
  const { numberFormat, measurementFormat } = useUserStore((state) => state)
  const { showModal } = useCustomModal()

  const handleOnShowConversions = (
    e: React.MouseEvent,
    ingredient: IngredientParams,
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

  return props.ingredients.length ? (
    <ul className={mergeCss('list-disc', props.className)}>
      {props.ingredients.map((ingredient) => {
        const { amount, unit } = determineAmountUnit(
          ingredient.amount,
          ingredient.unit,
          measurementFormat,
        )
        return (
          <li key={ingredient.id} className="text-left">
            <span>
              {determineAmountFormat(
                amount,
                props.scaleFactor,
                ingredient.isFraction,
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
                onClick={(e) => handleOnShowConversions(e, ingredient)}
              >
                {unit}
              </a>
            ) : null}
            {ingredient.name}
          </li>
        )
      })}
    </ul>
  ) : null
}
export default IngredientList
