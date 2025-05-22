'use client';

import {RecipeSteps, NutritionalFacts, RecipeIngredients, RecipeLayout} from "./_components";
import { useEffect, useState, use } from "react";
import {useRecipesControllerRecipeV1} from '@repo/recipes-codegen/recipes';
//import type { RecipeEntity } from '@repo/recipes-codegen/models';
import type {RecipeEntity} from '../../../../node_modules/@repo/recipes-codegen/dist/types/model/recipeEntity';

export default function Page({ params }: { params: Promise<{ slug: string }>  }) {
  const [recipe, setRecipe] = useState<RecipeEntity | null>(null);
  const {slug} = use(params)
  const {isSuccess, data} = useRecipesControllerRecipeV1(slug)

  useEffect(() => {
    if (isSuccess) {
      setRecipe(data);
      console.log('data', data);
    }
  }, [data, isSuccess]);

  return (
    <>
      {recipe && (
        <RecipeLayout title={recipe.name} subtitle={recipe.description}>
          <RecipeIngredients steps={recipe.steps} />
          <RecipeSteps steps={recipe.steps} />
          <NutritionalFacts nutritionalFacts={recipe.nutritionalFacts} />
        </RecipeLayout>
      )}
    </>
  );
}