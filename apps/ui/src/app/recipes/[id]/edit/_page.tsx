'use client'

import type { PatchRecipeDto } from '@repo/codegen/model'
import { useRecipesControllerUpdateRecipeV1 } from '@repo/codegen/recipes'
import { TextButton } from '@repo/design-system'
import { RecipeInput } from '@src/components/recipeInput'

const EditPage = () => {
  const { mutate } = useRecipesControllerUpdateRecipeV1({
    mutation: { retry: false },
  })

  const handleSubmit = () => {
    mutate(
      { id: '', data: {} as PatchRecipeDto },
      {
        onSuccess: () => undefined,
        onError: () => undefined,
      },
    )

    window.history.replaceState(null, '', '/recipes')
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
