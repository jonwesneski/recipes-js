import { type RecipeResponse } from '@repo/codegen/model'
import { recipesControllerRecipeV1 } from '@repo/codegen/recipes'
import '@repo/design-system/styles.css'
import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) => {
  const token = (await cookies()).get('access_token')
  if (!token) {
    notFound()
  }

  const id = (await params).id

  let data: RecipeResponse
  try {
    data = await recipesControllerRecipeV1(id, {
      params: { byOwner: true },
      headers: {
        cookie: `${token.name}=${token.value}`,
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
