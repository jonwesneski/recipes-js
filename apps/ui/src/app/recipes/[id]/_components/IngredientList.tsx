'use client'

import type { IngredientEntity } from '@repo/codegen/model'
import { type ClassValue, mergeCss, useCustomModal } from '@repo/design-system'
import { useUserStore } from '@src/providers/use-store-provider'
import {
  determineAmountUnit,
  numberToFraction,
  roundToDecimal,
  type VolumeUnit,
  type WeightUnit,
} from '@src/utils/measurements'
import { ModalMeasurementConversions } from './ModalMeasurementConversions'

type IngredientParams = Omit<IngredientEntity, 'createdAt' | 'updatedAt'>

interface IngredientListProps {
  ingredients: IngredientParams[]
  scaleFactor: number
  className?: ClassValue
}
const IngredientList = (props: IngredientListProps) => {
  const { useFractions, measurementFormat } = useUserStore((state) => state)
  const { showModal } = useCustomModal()

  const handleOnShowConversions = (
    e: React.MouseEvent,
    ingredient: IngredientParams,
  ) => {
    e.preventDefault()
    if (ingredient.unit !== null) {
      showModal(
        ModalMeasurementConversions.name,
        () => (
          <ModalMeasurementConversions
            unitType={ingredient.unit as VolumeUnit | WeightUnit}
            amount={roundToDecimal(ingredient.amount * props.scaleFactor, 2)}
            name={ingredient.name}
          />
        ),
        {},
      )
    }
  }

  return (
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
              {useFractions
                ? numberToFraction(
                    roundToDecimal(amount * props.scaleFactor, 2),
                  )
                : roundToDecimal(amount * props.scaleFactor, 2)}
            </span>{' '}
            {unit ? (
              /*eslint-disable-next-line jsx-a11y/anchor-is-valid -- for now*/
              <a
                href="#"
                className={
                  'inline-block underline decoration-dotted underline-offset-4'
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
  )
}
export default IngredientList
