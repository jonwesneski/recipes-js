import { type RecipeEntity } from '@repo/codegen/model'
import { recipesControllerRecipeV1 } from '@repo/codegen/recipes'
import '@repo/design-system/styles.css'
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
  const token = (await cookies()).get('access_token')?.value
  if (!token) {
    notFound()
  }

  const id = (await params).id

  let data: RecipeEntity
  try {
    data = await recipesControllerRecipeV1(id, {
      params: { byOwner: true },
      // TODO: Remove headers. nestjs is not able to access cookie right now
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error(error)
    notFound()
  }

  return (
    <RecipeStoreProvider initialState={data}>{children}</RecipeStoreProvider>
  )
}
export default Layout
