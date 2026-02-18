import {
  CuisineTypeSchema,
  DietaryTypeSchema,
  DifficultyLevelTypeSchema,
  DishTypeSchema,
  MealTypeSchema,
  ProteinTypeSchema,
} from '@repo/zod-schemas';
import { determineAmountFormat } from '@src/utils/measurements';
import { z } from 'zod/v4';

const MeasurementUnitSchema = z.enum([
  'cups',
  'fluidOunces',
  'tablespoons',
  'teaspoons',
  'pints',
  'quarts',
  'gallons',
  'pounds',
  'ounces',
  'liters',
  'milliliters',
  'kilograms',
  'grams',
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
  //   polyunsaturatedFatInG: z.number().nullable(),
  //   monounsaturatedFatInG: z.number().nullable(),
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
  id: z.string().optional(),
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
  createdAt: z.string(),
  updatedAt: z.string(),
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

const NormalizedIngredientSchema = z.object({
  amount: z.object({
    display: z.string(),
    value: IngredientInputSchema.shape.amount,
    errors: z.array(z.string()).optional(),
  }),
  isFraction: IngredientInputSchema.shape.isFraction,
  unit: z.object({
    display: z.string(),
    value: IngredientInputSchema.shape.unit,
    errors: z.array(z.string()).optional(),
  }),
  name: z.object({
    display: z.string(),
    value: IngredientInputSchema.shape.name,
    errors: z.array(z.string()).optional(),
  }),
});

const NormalizedStepSchema = z.object({
  id: z.string().optional(),
  instruction: z.string().nullable(),
  imageUrl: z.string().nullable(),
  ingredientIds: z.array(z.string()),
});

const NormalizedUserSchema = RecipeUserInputSchema;

const NormalizedRecipeSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  preparationTimeInMinutes: z.number().nullable(),
  cookingTimeInMinutes: z.number().nullable(),
  imageUrl: z.string().nullable(),
  equipments: z.array(z.string()),
  stepIds: z.array(z.string()),
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
  isPublic: z.boolean().optional(),
  bookmarked: z.boolean().optional(),
  user: NormalizedUserSchema,
  nutritionalFacts: NormalizedNutritionalFactsSchema.nullable(),
  steps: z.record(z.string(), NormalizedStepSchema),
  ingredients: z.record(z.string(), NormalizedIngredientSchema),
});

export const transformRecipeToNormalized = (
  data: z.infer<typeof RecipeInputSchema>,
) => {
  const validated = RecipeInputSchema.parse(data);

  // Normalize steps - extract ingredients and store separately
  const stepsRecord: Record<string, z.infer<typeof NormalizedStepSchema>> = {};
  const ingredientsRecord: Record<
    string,
    z.infer<typeof NormalizedIngredientSchema>
  > = {};

  validated.steps.forEach((step) => {
    const stepId = `step-${validated.id}-${step.id}`;

    const ingredientIds = step.ingredients.map((ing, ingIndex) => {
      const ingredientId = `ing-${stepId}-${ingIndex}`;
      ingredientsRecord[ingredientId] = {
        amount: {
          value: ing.amount,
          display: determineAmountFormat(
            ing.amount,
            1,
            ing.isFraction,
            'default',
          ),
        },
        isFraction: ing.isFraction,
        unit: {
          value: ing.unit,
          display: ing.unit ?? '',
        },
        name: {
          value: ing.name,
          display: ing.name,
        },
      };
      return ingredientId;
    });

    stepsRecord[stepId] = {
      id: stepId,
      instruction: step.instruction,
      imageUrl: step.imageUrl,
      ingredientIds,
    };
  });

  // Build normalized structure
  const normalized: z.infer<typeof NormalizedRecipeSchema> = {
    id: validated.id,
    createdAt: validated.createdAt,
    updatedAt: validated.updatedAt,
    name: validated.name,
    description: validated.description,
    preparationTimeInMinutes: validated.preparationTimeInMinutes,
    cookingTimeInMinutes: validated.cookingTimeInMinutes,
    imageUrl: validated.imageUrl,
    equipments: validated.equipments,
    stepIds: Object.keys(stepsRecord),
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
    isPublic: validated.isPublic,
    bookmarked: validated.bookmarked,
    steps: stepsRecord,
    ingredients: ingredientsRecord,
    user: validated.user,
    nutritionalFacts: validated.nutritionalFacts,
  };

  return NormalizedRecipeSchema.parse(normalized);
};

export type NormalizedRecipe = z.infer<typeof NormalizedRecipeSchema>;
export type NormalizedStep = z.infer<typeof NormalizedStepSchema>;
export type NormalizedIngredient = z.infer<typeof NormalizedIngredientSchema>;
export type NormalizedUser = z.infer<typeof NormalizedUserSchema>;
export type NormalizedNutritionalFacts = z.infer<
  typeof NormalizedNutritionalFactsSchema
>;
