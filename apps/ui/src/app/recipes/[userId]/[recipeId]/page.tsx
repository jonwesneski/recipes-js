'use client'

import type { RecipeEntity } from '@repo/codegen/model'
import { useRecipesControllerRecipeV1 } from '@repo/codegen/recipes'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import {
  createIngredientsItem,
  createStepItem,
  IngredientItemType,
  InstructionsType,
  type RecipeState,
} from '@src/stores/recipe-store'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import { use, useEffect, useState } from 'react'
import {
  NutritionalFacts,
  RecipeIngredientsOverview,
  RecipeLayout,
  RecipeSteps,
} from './_components'

const transformRecipe = (recipe: RecipeEntity): RecipeState => {
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = recipe
  return {
    ...rest,
    imageSrc: recipe.imageUrl,
    steps: recipe.steps.map((s) => {
      return createStepItem({
        ingredients: createIngredientsItem(
          s.ingredients.map(
            (i) =>
              new IngredientItemType({
                ingredient: new IngredientValidator({
                  dto: { amount: i.amount, unit: i.unit, name: i.name },
                }),
              }),
          ),
        ),
        instructions: new InstructionsType({
          value: s.instruction ?? undefined,
        }),
      })
    }),
    isValid: true,
    errors: {},
  }
}

const Page = ({
  params,
}: {
  params: Promise<{ userId: string; recipeId: string }>
}) => {
  const [recipe, setRecipe] = useState<RecipeEntity | null>(null)
  const { userId, recipeId } = use(params)

  const { isSuccess, data } = useRecipesControllerRecipeV1(userId, recipeId)

  useEffect(() => {
    if (isSuccess) {
      setRecipe(data)
    }
  }, [data, isSuccess])

  return (
    <>
      {recipe ? (
        <RecipeStoreProvider initialState={transformRecipe(recipe)}>
          <RecipeLayout
            title={recipe.name}
            subtitle={recipe.description ?? undefined}
          >
            <RecipeIngredientsOverview className="my-5" />
            <RecipeSteps />

            <NutritionalFacts />
          </RecipeLayout>
        </RecipeStoreProvider>
      ) : null}
    </>
  )
}
export default Page
