'use client'

import { DeleteRecipeButton, EditRecipeButton } from '@src/components'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { NutritionalFacts } from './NutritionalFacts'
import { RecipeDurations } from './RecipeDurations'
import { RecipeIngredientsOverview } from './RecipeIngredientsOverview'
import { RecipeUserBanner } from './RecipeUserBanner'
import { StepList } from './StepList'

export const RecipePage = () => {
  const name = useRecipeStore((state) => state.name)
  const description = useRecipeStore((state) => state.description)

  return (
    <div className="relative m-auto max-w-[800px]">
      <h1 className="text-center text-3xl font-bold">{name}</h1>
      <div className="absolute top-0 right-0 flex gap-3">
        <DeleteRecipeButton />
        <EditRecipeButton />
      </div>
      <hr className="my-6 h-1 bg-text border-none" />
      <RecipeUserBanner />
      <p className="my-12 text-center">{description}</p>
      <RecipeIngredientsOverview className="my-5" />
      <RecipeDurations />
      <StepList />
      <NutritionalFacts className="my-28" />
    </div>
  )
}
