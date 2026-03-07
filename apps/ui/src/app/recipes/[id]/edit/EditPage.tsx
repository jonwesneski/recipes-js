'use client'

import { useRecipesControllerUpdateRecipeV1 } from '@repo/codegen/recipes'
import { TextButton } from '@repo/design-system'
import { RecipeInput } from '@src/components/recipeInput'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useRouter } from 'next/navigation'
import { type FormEvent } from 'react'

const EditPage = () => {
  const id = useRecipeStore((state) => state.id)
  const makePatchDto = useRecipeStore((state) => state.makePatchDto)
  const setBadRequest = useRecipeStore((state) => state.setErrors)

  const { mutate } = useRecipesControllerUpdateRecipeV1({
    mutation: { retry: false },
  })
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null
    const isPublic = submitter?.value === 'public'

    mutate(
      { id, data: makePatchDto(isPublic) },
      {
        onSuccess: () => router.push(`/recipes/${id}`),
        onError: (error) => {
          if (error.response?.data) {
            setBadRequest(error.response.data)
          }
        },
      },
    )
  }

  return (
    <form className="px-3" onSubmit={handleSubmit}>
      <RecipeInput />
      <div className="mt-3 flex justify-center gap-3">
        <TextButton text="save public" type="submit" value="public" />
        <TextButton
          variant="opposite"
          text="save private"
          type="submit"
          value="private"
        />
      </div>
    </form>
  )
}
export default EditPage
