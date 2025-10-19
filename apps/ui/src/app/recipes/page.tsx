'use client'

import { type RecipeMinimalResponse } from '@repo/codegen/model'
import { useRecipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { RecipeTile } from '../../components/RecipeTile'

const Page = () => {
  const { data, isSuccess } = useRecipesControllerRecipesListV1({
    query: { refetchOnWindowFocus: false },
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {isSuccess && Array.isArray(data.data)
        ? data.data.map((recipe: RecipeMinimalResponse) => (
            <RecipeTile
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              imageUrl={recipe.imageUrl ?? undefined}
              name={recipe.name}
              starred={false}
              preparationTimeInMinutes={recipe.preparationTimeInMinutes}
              cookingTimeInMinutes={recipe.cookingTimeInMinutes}
            />
          ))
        : null}
    </div>
  )
}
export default Page
