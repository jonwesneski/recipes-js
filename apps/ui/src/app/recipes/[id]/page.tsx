import { recipesControllerRecipeV1 } from '@repo/codegen/recipes'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { getAccessToken } from '@src/utils/getAccessToken'
import { type Metadata } from 'next'
import { cache } from 'react'
import { RecipePage } from './_components'

const getRecipe = cache(async (id: string) => {
  const token = await getAccessToken()
  let headers
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    }
  }
  return recipesControllerRecipeV1(id, {
    params: { byOwner: false },
    headers,
  })
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const recipe = await getRecipe(id)

  return {
    title: `${recipe.name} | recipehall.`,
    description: recipe.description,
    openGraph: {
      title: recipe.name,
      description: recipe.description ?? undefined,
      images: recipe.imageUrl
        ? {
            url: recipe.imageUrl,
            secureUrl: recipe.imageUrl,
            width: 1200, // Recommended width
            height: 630, // Recommended height
            alt: recipe.name,
          }
        : undefined,
      type: 'article',
    },
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const recipe = await getRecipe(id)

  return (
    <RecipeStoreProvider initialState={recipe}>
      <RecipePage />
    </RecipeStoreProvider>
  )
}
export default Page
