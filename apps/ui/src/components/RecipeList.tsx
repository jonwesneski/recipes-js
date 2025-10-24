import type { RecipeListResponse } from '@repo/codegen/model'
import { RecipeTile } from './RecipeTile'

interface IRecipesListProps {
  recipes: RecipeListResponse
}
export const RecipeList = ({ recipes }: IRecipesListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {recipes.data.map((recipe) => (
        <RecipeTile key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
