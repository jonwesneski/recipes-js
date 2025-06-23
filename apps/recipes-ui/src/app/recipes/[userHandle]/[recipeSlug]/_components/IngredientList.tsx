'use client'

import type { IngredientEntity } from '@repo/recipes-codegen/models'
import { useCustomModal } from '@repo/ui'
import { useUserStore } from '@src/providers/use-store-provider'
import {
  numberToFraction,
  type VolumeUnit,
  type WeightUnit,
} from '@src/utils/measurements'
import { ModalMeasurementConversions } from './ModalMeasurementConversions'

export const IngredientList = ({
  ingredients,
}: {
  ingredients: IngredientEntity[]
}) => {
  const useFractions = useUserStore((state) => state.useFractions)
  const { showModal } = useCustomModal()

  const handleClick = (e: React.MouseEvent, ingredient: IngredientEntity) => {
    if (ingredient.unit !== 'whole' && ingredient.unit !== 'pinches') {
      e.preventDefault()
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
    <ul className="ingredient-list">
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
              // eslint-disable-next-line no-script-url -- for now
              href="javascript:void(0)"
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
