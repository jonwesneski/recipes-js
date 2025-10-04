'use client'

import { type ClassValue, mergeCss } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { roundToDecimal } from '@src/utils/measurements'
import {
  getNameAndUnit,
  nutritionalFactsWithoutServingsConst,
} from '@src/utils/nutritionalFacts'

interface INutritionalFactsProps {
  className?: ClassValue
}
export const NutritionalFacts = (props: INutritionalFactsProps) => {
  const { nutritionalFacts, scaleFactor } = useRecipeStore((state) => state)

  return (
    <div className={mergeCss(undefined, props.className)}>
      <h3 className="font-bold text-center">Nutritional Facts:</h3>
      <table className="border border-collapse m-auto">
        <tbody>
          {Object.keys(nutritionalFactsWithoutServingsConst).map((key) => {
            const [name, unit] = getNameAndUnit(key)
            const _unit = unit === 'IU' ? unit : unit.toLowerCase()
            return (
              <tr className="border" key={key}>
                <td className="text-right pl-3">{name}</td>
                <td className="text-left px-4">
                  {nutritionalFacts?.[key as keyof typeof nutritionalFacts]
                    ? `${roundToDecimal((nutritionalFacts[key as keyof typeof nutritionalFacts] as number) * scaleFactor, 2)} ${_unit}`
                    : `? ${_unit}`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
