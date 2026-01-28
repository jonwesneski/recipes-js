import {
  CuisineTypeSchema,
  DietaryTypeSchema,
  DifficultyLevelTypeSchema,
  DishTypeSchema,
  MealTypeSchema,
  ProteinTypeSchema,
} from '@repo/zod-schemas';
import { z } from 'zod/v4';

const MeasurementUnitSchema = z.enum([
  'TABLESPOON',
  'TEASPOON',
  'CUP',
  'GRAM',
  'MILLILITER',
  'KILOGRAM',
  'LITER',
  'OUNCE',
  'POUND',
  'PINCH',
  'WHOLE',
]);

const NutritionalFactsInputSchema = z.object({
  proteinInG: z.number().nullable(),
  totalFatInG: z.number().nullable(),
  carbohydratesInG: z.number().nullable(),
  fiberInG: z.number().nullable(),
  sugarInG: z.number().nullable(),
  sodiumInMg: z.number().nullable(),
  cholesterolInMg: z.number().nullable(),
  saturatedFatInG: z.number().nullable(),
  transFatInG: z.number().nullable(),
  polyunsaturatedFatInG: z.number().nullable(),
  monounsaturatedFatInG: z.number().nullable(),
  calciumInMg: z.number().nullable(),
  ironInMg: z.number().nullable(),
  potassiumInMg: z.number().nullable(),
  vitaminAInIU: z.number().nullable(),
  vitaminCInMg: z.number().nullable(),
  vitaminDInIU: z.number().nullable(),
  vitaminB6InMg: z.number().nullable(),
  vitaminB12InMg: z.number().nullable(),
  magnesiumInMg: z.number().nullable(),
  folateInMcg: z.number().nullable(),
  thiaminInMg: z.number().nullable(),
  riboflavinInMg: z.number().nullable(),
  niacinInMg: z.number().nullable(),
  caloriesInKcal: z.number().nullable(),
});

const IngredientInputSchema = z.object({
  id: z.string(),
  amount: z.number(),
  isFraction: z.boolean(),
  unit: MeasurementUnitSchema.nullable(),
  name: z.string(),
});

const StepInputSchema = z.object({
  id: z.string(),
  instruction: z.string().nullable(),
  imageUrl: z.string().nullable(),
  ingredients: z.array(IngredientInputSchema),
});

const RecipeUserInputSchema = z.object({
  id: z.string(),
  handle: z.string(),
  imageUrl: z.string().nullable(),
  amIFollowing: z.boolean().optional(),
});

const RecipeInputSchema = z.object({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  name: z.string(),
  description: z.string().nullable(),
  preparationTimeInMinutes: z.number().nullable(),
  cookingTimeInMinutes: z.number().nullable(),
  imageUrl: z.string().nullable(),
  equipments: z.array(z.string()),
  steps: z.array(StepInputSchema),
  nutritionalFacts: NutritionalFactsInputSchema.nullable(),
  servings: z.number().nullable(),
  servingAmount: z.number().nullable(),
  servingUnit: MeasurementUnitSchema.nullable(),
  tags: z.array(z.string()),
  cuisine: CuisineTypeSchema.nullable(),
  meal: MealTypeSchema.nullable(),
  dish: DishTypeSchema.nullable(),
  diets: z.array(DietaryTypeSchema),
  difficultyLevel: DifficultyLevelTypeSchema.nullable(),
  proteins: z.array(ProteinTypeSchema),
  user: RecipeUserInputSchema,
  isPublic: z.boolean().optional(),
  bookmarked: z.boolean().optional(),
});

const NormalizedNutritionalFactsSchema = NutritionalFactsInputSchema;

const NormalizedIngredientSchema = IngredientInputSchema;

const NormalizedStepSchema = z.object({
  id: z.string(),
  instruction: z.string().nullable(),
  imageUrl: z.string().nullable(),
  ingredientIds: z.array(z.string()),
});

const NormalizedUserSchema = RecipeUserInputSchema;

const NormalizedRecipeSchema = z.object({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  name: z.string(),
  description: z.string().nullable(),
  preparationTimeInMinutes: z.number().nullable(),
  cookingTimeInMinutes: z.number().nullable(),
  imageUrl: z.string().nullable(),
  equipments: z.array(z.string()),
  stepIds: z.array(z.string()),
  nutritionalFactsId: z.string().nullable(),
  servings: z.number().nullable(),
  servingAmount: z.number().nullable(),
  servingUnit: MeasurementUnitSchema.nullable(),
  tags: z.array(z.string()),
  cuisine: CuisineTypeSchema.nullable(),
  meal: MealTypeSchema.nullable(),
  dish: DishTypeSchema.nullable(),
  diets: z.array(DietaryTypeSchema),
  difficultyLevel: DifficultyLevelTypeSchema.nullable(),
  proteins: z.array(ProteinTypeSchema),
  userId: z.string(),
  isPublic: z.boolean().optional(),
  bookmarked: z.boolean().optional(),
});

export const NormalizedRecipeDataSchema = z.object({
  recipe: NormalizedRecipeSchema,
  steps: z.array(NormalizedStepSchema),
  ingredients: z.array(NormalizedIngredientSchema),
  users: z.array(NormalizedUserSchema),
  nutritionalFacts: z.array(NormalizedNutritionalFactsSchema),
});

export const transformRecipeToNormalized = (
  data: z.infer<typeof RecipeInputSchema>,
) => {
  const validated = RecipeInputSchema.parse(data);

  const nutritionalFactsId = validated.nutritionalFacts
    ? 'nf-' + validated.id
    : null;

  // Normalize steps - extract ingredients and store separately
  const steps: z.infer<typeof NormalizedStepSchema>[] = [];
  const ingredients: z.infer<typeof NormalizedIngredientSchema>[] = [];

  validated.steps.forEach((step, stepIndex) => {
    const stepId = `step-${validated.id}-${step.id}`;

    const ingredientIds = step.ingredients.map((ing, ingIndex) => {
      const ingredientId = `ing-${stepId}-${ingIndex}`;
      ingredients.push({
        ...ing,
        id: ingredientId,
      });
      return ingredientId;
    });

    steps.push({
      id: stepId,
      instruction: step.instruction,
      imageUrl: step.imageUrl,
      ingredientIds,
    });
  });

  // Build normalized structure
  const normalized: z.infer<typeof NormalizedRecipeDataSchema> = {
    recipe: {
      id: validated.id,
      createdAt: validated.createdAt,
      updatedAt: validated.updatedAt,
      name: validated.name,
      description: validated.description,
      preparationTimeInMinutes: validated.preparationTimeInMinutes,
      cookingTimeInMinutes: validated.cookingTimeInMinutes,
      imageUrl: validated.imageUrl,
      equipments: validated.equipments,
      stepIds: steps.map((s) => s.id),
      nutritionalFactsId,
      servings: validated.servings,
      servingAmount: validated.servingAmount,
      servingUnit: validated.servingUnit,
      tags: validated.tags,
      cuisine: validated.cuisine,
      meal: validated.meal,
      dish: validated.dish,
      diets: validated.diets,
      difficultyLevel: validated.difficultyLevel,
      proteins: validated.proteins,
      userId: validated.user.id,
      isPublic: validated.isPublic,
      bookmarked: validated.bookmarked,
    },
    steps,
    ingredients,
    users: [validated.user],
    nutritionalFacts: validated.nutritionalFacts
      ? [{ ...validated.nutritionalFacts }]
      : [],
  };

  return NormalizedRecipeDataSchema.parse(normalized);
};

export type NormalizedRecipe = z.infer<typeof NormalizedRecipeSchema>;
export type NormalizedStep = z.infer<typeof NormalizedStepSchema>;
export type NormalizedIngredient = z.infer<typeof NormalizedIngredientSchema>;
export type NormalizedUser = z.infer<typeof NormalizedUserSchema>;
export type NormalizedNutritionalFacts = z.infer<
  typeof NormalizedNutritionalFactsSchema
>;
export type NormalizedRecipeData = z.infer<typeof NormalizedRecipeDataSchema>;
