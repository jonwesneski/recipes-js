'use client'

import type { RecipeListResponse } from '@repo/codegen/model'
import { useRecipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { useRecipesListStore } from '@src/providers/recipes-list-store-provider'
import { useEffect } from 'react'
import { RecipeTile } from './RecipeTile'

interface IRecipesListProps {
  recipes: RecipeListResponse
}
export const RecipeList = (props: IRecipesListProps) => {
  const { recipes, setRecipes } = useRecipesListStore()

  useEffect(() => {
    setRecipes(props.recipes)
  }, [])

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- todo handle inifinite scrolling
  const { mutate } = useRecipesControllerRecipesListV1({
    mutation: { retry: false },
  })
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {recipes.map((recipe) => (
        <RecipeTile key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
