'use client'

import type { IngredientEntity } from '@repo/codegen/model'
import { type ClassValue, mergeCss, useCustomModal } from '@repo/design-system'
import { useUserStore } from '@src/providers/use-store-provider'
import {
  numberToFraction,
  type VolumeUnit,
  type WeightUnit,
} from '@src/utils/measurements'
import { ModalMeasurementConversions } from './ModalMeasurementConversions'

type IngredientParams = Omit<IngredientEntity, 'createdAt' | 'updatedAt'>

interface IngredientListProps {
  ingredients: IngredientParams[]
  className?: ClassValue
}
const IngredientList = (props: IngredientListProps) => {
  const useFractions = useUserStore((state) => state.useFractions)
  const { showModal } = useCustomModal()

  const handleClick = (e: React.MouseEvent, ingredient: IngredientParams) => {
    e.preventDefault()
    if (ingredient.unit !== 'whole' && ingredient.unit !== 'pinches') {
      showModal(
        ModalMeasurementConversions.name,
        () => (
          <ModalMeasurementConversions
            unitType={ingredient.unit as VolumeUnit | WeightUnit}
            amount={ingredient.amount}
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
        return (
          <li key={ingredient.id} className="text-left">
            <span>
              {useFractions
                ? numberToFraction(ingredient.amount)
                : ingredient.amount}
            </span>{' '}
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid -- for now*/}
            <a
              href="#"
              className={
                'inline-block underline decoration-dotted underline-offset-4'
              }
              onClick={(e) => handleClick(e, ingredient)}
            >
              {ingredient.unit}
            </a>{' '}
            {ingredient.name}
          </li>
        )
      })}
    </ul>
  )
}
export default IngredientList
