'use client'

import type { EditRecipeDto } from '@repo/codegen/model'
import { useRecipesControllerUpdateRecipeV1 } from '@repo/codegen/recipes'
import { tagsControllerTagNameListV1 } from '@repo/codegen/tags'
import { Button } from '@repo/design-system'
import { RecipeInput } from '@src/components/recipeInput'
import { useAuthentication } from '@src/providers/authentication-provider'
import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { useEffect, useState } from 'react'

const Page = () => {
  const { accessToken } = useAuthentication()
  const { mutate } = useRecipesControllerUpdateRecipeV1({
    mutation: { retry: false },
    request: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

  const handleSubmit = () => {
    mutate(
      { id: '', data: {} as EditRecipeDto },
      {
        onSuccess: () => undefined,
        onError: () => undefined,
      },
    )

    window.history.replaceState(null, '', '/recipes')
  }

  const [_tags, setTags] = useState<string[]>([])
  useEffect(() => {
    // todo add params
    const fetchTags = async () => {
      const currentTags = await tagsControllerTagNameListV1()
      setTags((tags) => [...tags, ...currentTags.data])
      if (currentTags.pagination.nextCursor !== null) {
        await fetchTags()
      }
    }

    fetchTags().catch((e: unknown) => console.log(e))
  }, [])

  return (
    <RecipeStoreProvider>
      <CameraProvider>
        <div className="flex justify-center">
          <div className="block mx-5">
            <RecipeInput />
            <Button
              className="mt-3 mx-auto block"
              text="submit"
              variant="opposite"
              onClick={() => handleSubmit()}
            />
          </div>
        </div>
      </CameraProvider>
    </RecipeStoreProvider>
  )
}
export default Page
