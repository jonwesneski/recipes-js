'use client'

import { useRecipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { Button } from '@repo/design-system'
import { NavigationLayout } from '@src/components/navigation/NavigationLayout'
import { useEffect } from 'react'

const Page = () => {
  const { data, isSuccess } = useRecipesControllerRecipesListV1()

  useEffect(() => {
    // will do somthing
  }, [isSuccess])

  return (
    <NavigationLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {isSuccess && Array.isArray(data)
          ? data.map((recipe) => (
              <div
                key={`${recipe.user.id}-${recipe.id}`}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold">{recipe.name}</h2>
                <p className="text-gray-600">{recipe.description}</p>
                <p>{recipe.tags.join(' ')}</p>
                <Button text={`/recipes/${recipe.user.id}/${recipe.id}`} />
              </div>
            ))
          : null}
      </div>
    </NavigationLayout>
  )
}
export default Page
