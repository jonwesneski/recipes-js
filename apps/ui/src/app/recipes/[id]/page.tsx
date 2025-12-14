import { recipesControllerRecipeV1 } from '@repo/codegen/recipes'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { type Metadata } from 'next'
import { cache } from 'react'
import {
  NutritionalFacts,
  RecipeDurations,
  RecipeIngredientsOverview,
  RecipeLayout,
  StepList,
} from './_components'

const getRecipe = cache(async (id: string) => {
  return recipesControllerRecipeV1(id, {
    params: { byOwner: false },
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
            width: 1200, // Recommended width (e.g., 1200x630 pixels)
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
      <RecipeLayout>
        <RecipeIngredientsOverview className="my-5" />
        <RecipeDurations />
        <StepList />
        <NutritionalFacts className="my-28" />
      </RecipeLayout>
    </RecipeStoreProvider>
  )
}
export default Page
