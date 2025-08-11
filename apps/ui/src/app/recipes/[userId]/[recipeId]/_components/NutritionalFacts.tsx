'use client'

import type { NutritionalFactsDto } from '@repo/codegen/model'
import { type ClassValue, mergeCss } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { camelCaseToSpaces } from '@src/utils/stringHelpers'

type _CompileTimeType = Omit<
  NutritionalFactsDto,
  'servings' | 'servingAmount' | 'servingUnit'
>
const nutritionalFactsConst: _CompileTimeType = {
  proteinInG: null,
  totalFatInG: null,
  carbohydratesInG: null,
  fiberInG: null,
  sugarInG: null,
  sodiumInMg: null,
  cholesterolInMg: null,
  saturatedFatInG: null,
  transFatInG: null,
  potassiumInMg: null,
  vitaminAInIU: null,
  vitaminCInMg: null,
  calciumInMg: null,
  ironInMg: null,
  vitaminDInIU: null,
  vitaminB6InMg: null,
  vitaminB12InMg: null,
  magnesiumInMg: null,
  folateInMcg: null,
  thiaminInMg: null,
  riboflavinInMg: null,
  niacinInMg: null,
  caloriesInKcal: null,
}

const getNameAndUnit = (nutritionalFactName: string) => {
  const [name, unit] = nutritionalFactName.split('In')
  return [camelCaseToSpaces(name), unit]
}

interface INutritionalFactsProps {
  className?: ClassValue
}
export const NutritionalFacts = (props: INutritionalFactsProps) => {
  const nutritionalFacts = useRecipeStore((state) => state.nutritionalFacts)

  return (
    <div className={mergeCss(undefined, props.className)}>
      <h3 className="font-bold text-center">Nutritional Facts:</h3>
      <table className="border border-collapse m-auto">
        <tbody>
          {Object.keys(nutritionalFactsConst).map((key) => {
            const [name, unit] = getNameAndUnit(key)
            const _unit = unit === 'IU' ? unit : unit.toLowerCase()
            return (
              <tr className="border" key={key}>
                <td className="text-right pl-3">{name}</td>
                <td className="text-left px-4">
                  {nutritionalFacts?.[key as keyof typeof nutritionalFacts]
                    ? `${nutritionalFacts[key as keyof typeof nutritionalFacts]} ${_unit}`
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
