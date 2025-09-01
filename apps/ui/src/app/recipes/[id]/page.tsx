'use client'

import type { RecipeEntity } from '@repo/codegen/model'
import { useRecipesControllerRecipeV1 } from '@repo/codegen/recipes'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { use, useEffect, useState } from 'react'
import {
  NutritionalFacts,
  RecipeIngredientsOverview,
  RecipeLayout,
  RecipeSteps,
} from './_components'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [recipe, setRecipe] = useState<RecipeEntity | null>(null)
  const { id } = use(params)

  const { isSuccess, data } = useRecipesControllerRecipeV1(id, {
    request: { params: { byOwner: false } },
  })

  useEffect(() => {
    if (isSuccess) {
      setRecipe(data)
    }
  }, [data, isSuccess])

  return (
    <>
      {recipe ? (
        <RecipeStoreProvider initialState={recipe}>
          <RecipeLayout>
            <RecipeIngredientsOverview className="my-5" />
            <RecipeSteps />
            <NutritionalFacts className="my-28" />
          </RecipeLayout>
        </RecipeStoreProvider>
      ) : null}
    </>
  )
}
export default Page
