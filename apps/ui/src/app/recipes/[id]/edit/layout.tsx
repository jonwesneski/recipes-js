import { type RecipeResponse } from '@repo/codegen/model'
import { recipesControllerRecipeV1 } from '@repo/codegen/recipes'
import '@repo/design-system/styles.css'
import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { getAccessToken } from '@src/utils/getAccessToken'
import { notFound } from 'next/navigation'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) => {
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
    <RecipeStoreProvider initialState={data}>
      <CameraProvider>{children}</CameraProvider>
    </RecipeStoreProvider>
  )
}
export default Layout
