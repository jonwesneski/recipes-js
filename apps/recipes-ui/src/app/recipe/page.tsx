'use client';

import {Instructions, NutritionalFacts, RecipeIngredients, RecipeLayout} from "./_components";
import { useEffect, useState } from "react";
import {useRecipesControllerRecipeV1} from '@repo/recipes-codegen/recipes';
//import type { RecipeEntity } from '@repo/recipes-codegen/models';
import type {RecipeEntity} from '../../../node_modules/@repo/recipes-codegen/dist/types/model/recipeEntity';

export default function Page() {
  const [recipe, setRecipe] = useState<RecipeEntity | null>(null);

  const {isSuccess, data} = useRecipesControllerRecipeV1('tres-leches-cake')

  useEffect(() => {
    if (isSuccess) {
      setRecipe(data as RecipeEntity);
      console.log('data', data);
    }
  }, [data, isSuccess]);

  return (
    <>
      {recipe && (
        <RecipeLayout title={recipe.name} subtitle={recipe.description}>
          <RecipeIngredients steps={recipe.steps} />
          <Instructions instruction={recipe} />
          <NutritionalFacts nutritionalFacts={recipe.nutritionalFacts} />
        </RecipeLayout>
      )}
    </>
  );
}