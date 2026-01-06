'use client'

import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { NutritionalFacts } from './NutritionalFacts'
import { RecipeDurations } from './RecipeDurations'
import { RecipeIngredientsOverview } from './RecipeIngredientsOverview'
import { RecipeUserBanner } from './RecipeUserBanner'
import { StepList } from './StepList'

export const RecipePage = () => {
  const { name, description } = useRecipeStore((state) => state)

  return (
    <div className="m-auto max-w-[800px]">
      <h1 className="text-center text-3xl font-bold">{name}</h1>
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
