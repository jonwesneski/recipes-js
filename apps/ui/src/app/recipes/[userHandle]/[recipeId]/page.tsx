/* eslint-disable react/jsx-no-leaked-render -- will add is loading state */
'use client'

import type { RecipeEntity } from '@repo/codegen/model'
import { useRecipesControllerRecipeV1 } from '@repo/codegen/recipes'
import { use, useEffect, useState } from 'react'
import {
  NutritionalFacts,
  RecipeIngredientsOverview,
  RecipeLayout,
  RecipeSteps,
} from './_components'

const Page = ({
  params,
}: {
  params: Promise<{ userHandle: string; recipeId: string }>
}) => {
  const [recipe, setRecipe] = useState<RecipeEntity | null>(null)
  const { userHandle, recipeId } = use(params)

  const { isSuccess, data } = useRecipesControllerRecipeV1(userHandle, recipeId)

  useEffect(() => {
    if (isSuccess) {
      setRecipe(data)
    }
  }, [data, isSuccess])

  return (
    <>
      {recipe && (
        <RecipeLayout title={recipe.name} subtitle={recipe.description}>
          <RecipeIngredientsOverview steps={recipe.steps} />
          <RecipeSteps steps={recipe.steps} />
          {recipe.nutritionalFacts && (
            <NutritionalFacts nutritionalFacts={recipe.nutritionalFacts} />
          )}
        </RecipeLayout>
      )}
    </>
  )
}
export default Page
