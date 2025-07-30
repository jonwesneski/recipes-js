'use client'

import { useRecipesControllerCreateRecipeV1 } from '@repo/codegen/recipes'
import { Button } from '@repo/design-system'
import { NavigationLayout } from '@src/components/navigation'
import { Recipe } from '@src/components/recipe'
import { useAuthentication } from '@src/providers/authentication-provider'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useRouter } from 'next/navigation'
import { type FormEvent } from 'react'

const Page = () => {
  const { accessToken } = useAuthentication()
  const { makeCreateDto, setBadRequest } = useRecipeStore((state) => state)
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
          router.push(`/recipes/${data.user.id}/${data.id}`)
        },
        onError: (error) => {
          setBadRequest(error.response?.data!)
        },
      },
    )
  }

  return (
    <NavigationLayout>
      <form
        className="flex justify-center flex-col px-3"
        onSubmit={handleSubmit}
      >
        <Recipe />
        <Button
          className="mt-3 mx-auto block"
          text="submit"
          variant="opposite"
          type="submit"
        />
      </form>
    </NavigationLayout>
  )
}
export default Page
