'use client'

import { DeleteRecipeButton } from '@src/components/DeleteButton'
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
    <div className="m-auto max-w-[800px] relative">
      <h1 className="text-center text-3xl font-bold">{name}</h1>
      <div className="absolute top-0 right-0">
        <DeleteRecipeButton />
        {/** TODO: add edit button */}
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
