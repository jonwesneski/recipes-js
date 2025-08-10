'use client'

import type { IngredientEntity } from '@repo/codegen/model'
import { useCustomModal } from '@repo/design-system'
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
}
export const IngredientList = ({ ingredients }: IngredientListProps) => {
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
          />
        ),
        {},
      )
    }
  }

  return (
    <ul>
      {ingredients.map((ingredient) => {
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
              className={'underline decoration-dotted'}
              onClick={(e) => handleClick(e, ingredient)}
              style={{
                color: 'black',
                display: 'inline-block',
                textUnderlineOffset: '4px',
              }}
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
