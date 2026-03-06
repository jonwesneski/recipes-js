'use client'

import type { PatchRecipeDto } from '@repo/codegen/model'
import { useRecipesControllerUpdateRecipeV1 } from '@repo/codegen/recipes'
import { TextButton } from '@repo/design-system'
import { RecipeInput } from '@src/components/recipeInput'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useRouter } from 'next/navigation'

const EditPage = () => {
  const id = useRecipeStore((state) => state.id)
  const { mutate } = useRecipesControllerUpdateRecipeV1({
    mutation: { retry: false },
  })
  const router = useRouter()

  const handleSubmit = () => {
    mutate(
      // todo: need to implement makeGeneratePatchDto
      { id: '', data: {} as PatchRecipeDto },
      {
        onSuccess: () => router.push(`/recipes/${id}`),
        onError: () => undefined,
      },
    )
  }

  return (
    <div className="flex justify-center">
      <div className="block mx-5">
        <RecipeInput />
        <TextButton
          className="mt-3 mx-auto block"
          text="submit"
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  )
}
export default EditPage
