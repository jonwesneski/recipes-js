'use client';

import {RecipeSteps, NutritionalFacts, RecipeIngredientsOverview, RecipeLayout} from "./_components";
import { useEffect, useState, use, MouseEventHandler } from "react";
import {useRecipesControllerRecipeV1} from '@repo/recipes-codegen/recipes';
import {SharedButton} from '../../../../node_modules/@repo/ui/dist/Button/SharedButton'
//import {SharedButton} from '@repo/ui'
//import type { RecipeEntity } from '@repo/recipes-codegen/models';
import type {RecipeEntity} from '../../../../node_modules/@repo/recipes-codegen/dist/types/model/recipeEntity';


// interface SharedButtonProps {
//   text: string
//   onClick?: MouseEventHandler<HTMLButtonElement>
// }
// export const SharedButton = (props: SharedButtonProps) => {
//  return (
//     <div className="rounded-md ring-4" style={{display: 'inline-block'}}>
//       <button className="rounded-md ring-3 shadow-[3px_3px_0px_3px_#000000] p-1 bg-green-700 text-white font-semibold" style={{margin: '0 auto'}} onClick={props.onClick}>
//         {`${props.text}.`}
//       </button>
//     </div>
//  )
// }

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
          <SharedButton text="sharedbutton" onClick={() => console.log('9')} />
          <RecipeIngredientsOverview steps={recipe.steps} />
          <RecipeSteps steps={recipe.steps} />
          <NutritionalFacts nutritionalFacts={recipe.nutritionalFacts} />
        </RecipeLayout>
      )}
    </>
  );
}
