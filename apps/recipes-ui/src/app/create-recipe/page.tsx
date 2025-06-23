'use client'

import { type CreateRecipeDto } from '@repo/recipes-codegen/models'
import { useRecipesControllerCreateRecipeV1 } from '@repo/recipes-codegen/recipes'
import { tagsControllerTagNameListV1 } from '@repo/recipes-codegen/tags'
import { SharedButton } from '@repo/ui'
import { Recipe } from '@src/components/recipe/RecipeComponent'
import { useAuthentication } from '@src/providers/authentication-provider'
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

  const [_tags, setTags] = useState<string[]>([])

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

  useEffect(() => {
    // todo add params
    const fetchTags = async () => {
      const currentTags = await tagsControllerTagNameListV1()
      setTags((tags) => [...tags, ...currentTags.data])
      if (currentTags.pagination.nextCursor !== null) {
        //await fetchTags()
      }
    }

    fetchTags().catch((e: unknown) => console.log(e))
  }, [])

  return (
    <div className="flex justify-center">
      <div className="create-recipe">
        {/*eslint-disable-next-line react/jsx-boolean-value -- always true*/}
        <Recipe editable={true} />
        <SharedButton text="submit" onClick={() => handleSubmit()} />
      </div>
    </div>
  )
}
export default Page
