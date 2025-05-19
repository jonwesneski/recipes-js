import { RecipeType } from '../../recipes.service';

export class RecipeEntity implements RecipeType {
  steps: ({
    ingredients: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      amount: number;
      unit: string;
      stepId: string;
    }[];
  } & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    instruction: string | null;
    recipeId: string;
  })[];
  nutritionalFacts: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    recipeId: string;
    calories: number | null;
    proteinInG: number | null;
    fatInG: number | null;
    carbsInG: number | null;
    fiberInG: number | null;
    sugarInG: number | null;
    sodiumInMg: number | null;
    cholesterolInMg: number | null;
    saturatedFatInG: number | null;
    transFatInG: number | null;
    potassiumInMg: number | null;
    vitaminAInIU: number | null;
    vitaminCInMg: number | null;
    calciumInMg: number | null;
    ironInMg: number | null;
    vitaminDInIU: number | null;
    vitaminB6InMg: number | null;
    vitaminB12InMg: number | null;
    magnesiumInMg: number | null;
    folateInMcg: number | null;
    thiaminInMg: number | null;
    riboflavinInMg: number | null;
    niacinInMg: number | null;
  }[];
  tags: { id: string; createdAt: Date; updatedAt: Date; name: string }[];
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  description: string | null;
  preparationTimeInMinutes: number | null;
  cookingTimeInMinutes: number | null;
  userId: string;
}
