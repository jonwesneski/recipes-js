'use client'

import { type RecipeEntity } from '@repo/codegen/model'
import { useRecipesControllerCreateRecipeV1 } from '@repo/codegen/recipes'
import { Button } from '@repo/design-system'
import { NavigationLayout } from '@src/components/navigation'
import { Recipe } from '@src/components/recipe'
import { useAuthentication } from '@src/providers/authentication-provider'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useRouter } from 'next/navigation'

const Page = () => {
  const { accessToken } = useAuthentication()
  const { makeCreateDto } = useRecipeStore((state) => state)
  const { mutate } = useRecipesControllerCreateRecipeV1({
    mutation: { retry: false },
    request: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
  const router = useRouter()

  const handleSubmit = () => {
    mutate(
      { data: makeCreateDto() },
      {
        onSuccess: (data) => {
          const _data = data as unknown as RecipeEntity
          router.push(`/recipes/${_data.user.id}/${_data.id}`)
        },
        onError: () => undefined,
      },
    )
  }

  return (
    <NavigationLayout>
      <div className="flex justify-center">
        <div>
          <Recipe />
          <Button
            className="mt-3 mx-auto block"
            text="submit"
            variant="opposite"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </NavigationLayout>
  )
}
export default Page
