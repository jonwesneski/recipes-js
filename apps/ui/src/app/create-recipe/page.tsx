'use client'

import { type CreateRecipeDto } from '@repo/codegen/model'
import { useRecipesControllerCreateRecipeV1 } from '@repo/codegen/recipes'
import { tagsControllerTagNameListV1 } from '@repo/codegen/tags'
import { Button } from '@repo/ui'
import { NavigationLayout } from '@src/components/navigation'
import { Recipe } from '@src/components/recipe'
import { useAuthentication } from '@src/providers/authentication-provider'
import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { useEffect, useState } from 'react'

const Page = () => {
  const { accessToken } = useAuthentication()
  const { mutate } = useRecipesControllerCreateRecipeV1({
    mutation: { retry: false },
    request: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

  const handleSubmit = () => {
    mutate(
      { data: {} as CreateRecipeDto },
      {
        onSuccess: () => undefined,
        onError: () => undefined,
      },
    )
    // router.replace('/recipes/jon/tres-leches-cake', undefined, {
    //   shallow: true,
    // })
    window.history.replaceState(null, '', '/recipes/jon/tres-leches-cake')
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
    <RecipeStoreProvider initialState={{ editEnabled: true }}>
      <CameraProvider>
        <NavigationLayout>
          <div className="flex justify-center">
            <div className="block mx-5">
              {/*eslint-disable-next-line react/jsx-boolean-value -- always true*/}
              <Recipe />
              <Button
                text="submit"
                variant="opposite"
                onClick={() => handleSubmit()}
              />
            </div>
          </div>
        </NavigationLayout>
      </CameraProvider>
    </RecipeStoreProvider>
  )
}
export default Page
