'use client'

import type { IngredientEntity } from '@repo/recipes-codegen/models'
import { useUserStore } from '../../../../../providers/use-store-provider'
import { numberToFraction } from '../../../../../utils'
import { useCustomModal } from '../../../../hooks/useCustomModal'
import { ModalMeasurementConversions } from './ModalMeasurementConversions'

export const IngredientList = ({
  ingredients,
}: {
  ingredients: IngredientEntity[]
}) => {
  const useFractions = useUserStore((state) => state.useFractions)
  const { showModal } = useCustomModal()

  const handleClick = (e: React.MouseEvent, ingredient: IngredientEntity) => {
    e.preventDefault()
    showModal(
      ModalMeasurementConversions.name,
      () => (
        <ModalMeasurementConversions
          unitType={ingredient.unit}
          amount={ingredient.amount}
        />
      ),
      {},
    )
  }

  return (
    <ul className="ingredient-list">
      {ingredients.map((ingredient, index) => {
        return (
          <li key={index} className="text-left">
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
