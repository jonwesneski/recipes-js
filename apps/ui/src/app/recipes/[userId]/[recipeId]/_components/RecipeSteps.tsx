'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { IngredientList } from './IngredientList'

interface IRecipeSteps {
  className?: ClassValue
}
export const RecipeSteps = (props: IRecipeSteps) => {
  const steps = useRecipeStore((state) => state.steps)

  return (
    <section className={mergeCss(undefined, props.className)}>
      {steps.map((s, index) => {
        return (
          <div key={s.keyId} className="mb-5">
            <h1 className="font-bold">step {index + 1}.</h1>
            <div
              ref={s.ref}
              className="flex flex-col md:flex-row gap-2 ml-2 mt-2"
            >
              <IngredientList
                className="ml-4"
                ingredients={s.ingredients.items.map((i) => ({
                  id: i.keyId,
                  ...i.ingredient.dto,
                }))}
              />
              <p>{s.instructions.value}</p>
            </div>
            {index < steps.length - 1 && <hr className="mt-5" />}
          </div>
        )
      })}
    </section>
  )
}
