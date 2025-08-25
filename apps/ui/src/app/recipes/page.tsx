'use client'

import { useRecipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { useEffect } from 'react'
import { RecipeTile } from './_components/RecipeTile'

const Page = () => {
  const { data, isSuccess } = useRecipesControllerRecipesListV1()

  useEffect(() => {
    // will do somthing
  }, [isSuccess])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {isSuccess && Array.isArray(data)
        ? data.map((recipe) => (
            <RecipeTile
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              imageUrl={recipe.imageUrl ?? undefined}
              name={recipe.name}
              starred={false}
            />
          ))
        : null}
    </div>
  )
}
export default Page
