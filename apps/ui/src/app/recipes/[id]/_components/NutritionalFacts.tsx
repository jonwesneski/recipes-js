'use client'

import { type ClassValue, mergeCss } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import { calculatePercentage, roundToDecimal } from '@src/utils/calculate'
import {
  getNameAndUnit,
  nutritionalFactsConst,
} from '@src/utils/nutritionalFacts'
import React from 'react'

interface INutritionalFactsProps {
  className?: ClassValue
}
export const NutritionalFacts = (props: INutritionalFactsProps) => {
  const { nutritionalFacts, scaleFactor } = useRecipeStore((state) => state)
  const { customDailyNutrition, predefinedDailyNutrition } = useUserStore(
    (state) => state,
  )
  const userNutritionalFacts =
    customDailyNutrition ?? predefinedDailyNutrition?.nutritionalFacts

  return (
    <div className={mergeCss(undefined, props.className)}>
      <h3 className="font-bold text-center">Nutritional Facts:</h3>
      <table className="border border-collapse m-auto">
        <tbody>
          <tr className="border">
            <th className="text-right pl-3">Name</th>
            <th className="text-left px-4">Amount</th>
            <th className="text-left px-4 border-l">Daily %</th>
          </tr>
          {Object.keys(nutritionalFactsConst).map((key) => {
            const [name, unit] = getNameAndUnit(key)
            const _unit = unit === 'IU' ? unit : unit.toLowerCase()
            const recipeNutrionalFact =
              nutritionalFacts?.[key as keyof typeof nutritionalFacts]
            const userNutritionalFact =
              userNutritionalFacts?.[key as keyof typeof nutritionalFacts]
            return (
              <React.Fragment key={key}>
                <tr className="border">
                  <td className="text-right pl-3">{name}</td>
                  <td className="text-left px-4">
                    {typeof recipeNutrionalFact === 'number'
                      ? `${roundToDecimal(recipeNutrionalFact * scaleFactor, 2)} ${_unit}`
                      : `? ${_unit}`}
                  </td>
                  <td className="text-left px-4 border-l">
                    {typeof recipeNutrionalFact === 'number' &&
                    typeof userNutritionalFact === 'number' &&
                    userNutritionalFact > 0
                      ? calculatePercentage(
                          recipeNutrionalFact,
                          userNutritionalFact,
                        )
                      : '?'}
                  </td>
                </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
