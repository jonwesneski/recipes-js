import { type RecipeResponse } from '@repo/codegen/model'
import { recipesControllerRecipeV1 } from '@repo/codegen/recipes'
import '@repo/design-system/styles.css'
import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { getAccessToken } from '@src/utils/getAccessToken'
import { transformRecipeToNormalized } from '@src/zod-schemas/recipeNormalized'
import { notFound } from 'next/navigation'
import EditPage from './_page'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const token = await getAccessToken()
  if (!token) {
    notFound()
  }

  const id = (await params).id

  let data: RecipeResponse
  try {
    data = await recipesControllerRecipeV1(id, {
      params: { byOwner: true },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error(error)
    notFound()
  }

  return (
    <RecipeStoreProvider initialState={transformRecipeToNormalized(data)}>
      <CameraProvider>
        <EditPage />
      </CameraProvider>
    </RecipeStoreProvider>
  )
}
export default Page
