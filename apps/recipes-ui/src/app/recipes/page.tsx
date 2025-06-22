'use client'

import { useRecipesControllerRecipesListV1 } from '@repo/recipes-codegen/recipes'
import { SharedButton } from '@repo/ui'
import { useEffect } from 'react'

const Page = () => {
  const { data, isSuccess } = useRecipesControllerRecipesListV1()

  useEffect(() => {
    // will do somthing
  }, [isSuccess])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {isSuccess &&
        Array.isArray(data) &&
        data.map((recipe) => (
          <div
            key={recipe.slug}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold">{recipe.name}</h2>
            <p className="text-gray-600">{recipe.description}</p>
            <p>{recipe.tags.join(' ')}</p>
            <SharedButton text={`/recipes/${recipe.slug}`} />
          </div>
        ))}
    </div>
  )
}
export default Page
