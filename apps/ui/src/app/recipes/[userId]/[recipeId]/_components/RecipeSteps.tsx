'use client'

import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { IngredientList } from './IngredientList'

export const RecipeSteps = () => {
  const steps = useRecipeStore((state) => state.steps)

  return (
    <div className="border">
      {steps.map((s, index) => {
        return (
          <div key={s.keyId} className="mb-5">
            <h1 className="font-bold">step {index + 1}.</h1>
            <div ref={s.ref} className="flex flex-col md:flex-row gap-2">
              <IngredientList
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
    </div>
  )
}
