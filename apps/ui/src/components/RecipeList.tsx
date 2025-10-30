'use client'

import type { RecipeListResponse } from '@repo/codegen/model'
import { useRecipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { RecipeTile } from './RecipeTile'

interface IRecipesListProps {
  recipes: RecipeListResponse
}
export const RecipeList = ({ recipes }: IRecipesListProps) => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- todo handle inifinite scrolling
  const { mutate } = useRecipesControllerRecipesListV1({
    mutation: { retry: false },
  })
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {recipes.data.map((recipe) => (
        <RecipeTile key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
