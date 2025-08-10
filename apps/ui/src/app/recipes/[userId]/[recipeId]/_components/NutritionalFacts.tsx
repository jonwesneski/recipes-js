'use client'

import type { NutritionalFactsDto } from '@repo/codegen/model'
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
export const NutritionalFacts = () => {
  const nutritionalFacts = useRecipeStore((state) => state.nutritionalFacts)

  return (
    <div
      className="nutritional-facts"
      style={{
        margin: '20px 0',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      <h3>Nutritional Facts:</h3>
      <table style={{ borderCollapse: 'collapse', margin: 'auto' }}>
        <tbody>
          {Object.keys(nutritionalFactsConst).map((key) => {
            const [name, unit] = getNameAndUnit(key)
            return (
              <tr key={key}>
                <td style={{ textAlign: 'left' }}>{name}</td>
                <td style={{ textAlign: 'left' }}>
                  {nutritionalFacts &&
                  nutritionalFacts[key as keyof typeof nutritionalFacts]
                    ? `${nutritionalFacts[key as keyof typeof nutritionalFacts]} ${unit}`
                    : `? ${unit}`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
