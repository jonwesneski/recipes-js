'use client'

import { useRecipesControllerCreateRecipeV1 } from '@repo/recipes-codegen/recipes'
import { tagsControllerTagNameListV1 } from '@repo/recipes-codegen/tags'
import { SharedButton, SharedInput } from '@repo/ui'
import { useEffect, useState } from 'react'
import { useAuthentication } from '../../providers/authentication-provider'
import { CreateSteps } from './_components/CreateSteps'

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
      { data: {} },
      {
        onSuccess: () => undefined,
        onError: () => undefined,
      },
    )
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
        <SharedInput name="recipe" placeHolder="Recipe name" />
        <SharedInput name="description" placeHolder="Short description" />
        <CreateSteps />
        <SharedButton text="submit" onClick={() => handleSubmit()} />
      </div>
    </div>
  )
}
export default Page
