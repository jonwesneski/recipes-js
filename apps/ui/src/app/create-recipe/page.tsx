'use client'

import { useRecipesControllerCreateRecipeV1 } from '@repo/codegen/recipes'
import { TextButton } from '@repo/design-system'
import { RecipeInput } from '@src/components/recipeInput'
import { useAuthentication } from '@src/providers/authentication-provider'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useRouter } from 'next/navigation'
import { type FormEvent } from 'react'

const Page = () => {
  const { accessToken } = useAuthentication()
  const { makeCreateDto, setErrors: setBadRequest } = useRecipeStore(
    (state) => state,
  )
  const { mutate } = useRecipesControllerCreateRecipeV1({
    mutation: { retry: false },
    request: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutate(
      { data: makeCreateDto() },
      {
        onSuccess: (data) => {
          router.push(`/recipes/${data.id}`)
        },
        onError: (error) => {
          if (error.response?.data) {
            setBadRequest(error.response.data)
          }
        },
      },
    )
  }

  return (
    <form className="flex flex-col px-3" onSubmit={handleSubmit}>
      <RecipeInput />
      <TextButton className="mt-3 mx-auto block" text="submit" type="submit" />
    </form>
  )
}
export default Page
