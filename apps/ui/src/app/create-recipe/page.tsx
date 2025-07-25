'use client'

import { type RecipeEntity } from '@repo/codegen/model'
import { useRecipesControllerCreateRecipeV1 } from '@repo/codegen/recipes'
import { tagsControllerTagNameListV1 } from '@repo/codegen/tags'
import { Button } from '@repo/design-system'
import { NavigationLayout } from '@src/components/navigation'
import { Recipe } from '@src/components/recipe'
import { useAuthentication } from '@src/providers/authentication-provider'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
    <NavigationLayout>
      <div className="flex justify-center">
        <div>
          <Recipe />
          <Button
            className="mt-3 mx-auto block"
            text="submit"
            variant="opposite"
            onClick={() => {
              console.log('asdfasdf')
              handleSubmit()
            }}
          />
        </div>
      </div>
    </NavigationLayout>
  )
}
export default Page
