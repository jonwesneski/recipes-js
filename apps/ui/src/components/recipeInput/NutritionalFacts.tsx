'use client'

import { useAiControllerNutritionalFactsV1 } from '@repo/codegen/ai'
import { NutritionalFactsEntity } from '@repo/codegen/model'
import { mergeCss, TextButton, TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import {
  getNameAndUnit,
  nutritionalFactsConst,
} from '@src/utils/nutritionalFacts'

interface NutritionalFactsProps {}
export const NutritionalFacts = (props: NutritionalFactsProps) => {
  const {
    nutritionalFacts,
    setNutritionalFacts,
    makeGenerateNutritionalFactsDto,
  } = useRecipeStore((state) => state)
  const { mutate } = useAiControllerNutritionalFactsV1({
    mutation: { retry: false },
  })

  const handleOnAutoGenerate = () => {
    mutate(
      { data: makeGenerateNutritionalFactsDto() },
      {
        onSuccess: (data) => {
          setNutritionalFacts(data)
        },
      },
    )
  }

  return (
    <div className={mergeCss('', {})}>
      <h1 className="text-3xl font-bold mb-10">Nutritional Facts</h1>
      <TextButton text="auto generate facts" onClick={handleOnAutoGenerate} />
      {Object.keys(nutritionalFactsConst).map((nf) => {
        const [name, unit] = getNameAndUnit(nf)
        return (
          <TextLabel
            key={nf}
            name={nf}
            isRequired={false}
            label={name}
            type="number"
            value={
              nutritionalFacts?.[
                nf as keyof NutritionalFactsEntity
              ]?.toString() || ''
            }
          />
        )
      })}
    </div>
  )
}
