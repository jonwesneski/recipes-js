'use client';

import { RecipeType } from "./types";
import {Instructions, NutritionalFacts, RecipeIngredients, RecipeLayout} from "./_components";
import { useEffect, useState } from "react";

// const recipe: RecipeType = {
//   name: 'Chocolate Cake',
//   steps: [{
//     ingredients: [
//       {name: 'Flour', amount: 2, measurement: 'cups'},
//       {name: 'Sugar', amount: 1, measurement: 'cup'},
//       {name: 'Eggs', amount: 2, measurement: 'large'},
//       {name: 'Butter', amount: 0.5, measurement: 'cup'},
//       {name: 'Baking Powder', amount: 1, measurement: 'teaspoon'},
//     ],
//     instructions: 'Mix all ingredients together and bake at 350°F for 30 minutes.'
//   }],
//   nutritionalFacts: {
//     calories: 250,
//     proteinInG: 5,
//     fatInG: 10,
//     carbohydratesInG: 40,
//     fiberInG: 2,
//     sugarInG: 20
//   },
//   tags: ['dessert', 'cake']
// }

export default function Page() {
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3001/v1/recipes/tres-leches-cake');
      setRecipe(await res.json());
    }
    fetchData();
  }, [])

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