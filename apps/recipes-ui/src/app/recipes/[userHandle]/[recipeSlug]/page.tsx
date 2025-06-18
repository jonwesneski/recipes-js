'use client';

import type { RecipeEntity } from '@repo/recipes-codegen/models';
import { useRecipesControllerRecipeV1 } from '@repo/recipes-codegen/recipes';
import { use, useEffect, useState } from "react";
import { NutritionalFacts, RecipeIngredientsOverview, RecipeLayout, RecipeSteps } from "./_components";


export default function Page({ params }: { params: Promise<{ userHandle: string, slug: string }>  }) {
  const [recipe, setRecipe] = useState<RecipeEntity | null>(null);
  const {userHandle, slug} = use(params)

  const {isSuccess, data} = useRecipesControllerRecipeV1(userHandle, slug)

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
          <RecipeIngredientsOverview steps={recipe.steps} />
          <RecipeSteps steps={recipe.steps} />
          {recipe.nutritionalFacts && (
            <NutritionalFacts nutritionalFacts={recipe.nutritionalFacts} />
          )}
        </RecipeLayout>
      )}
    </>
  );
}
