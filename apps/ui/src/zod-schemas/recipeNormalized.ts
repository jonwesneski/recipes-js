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

const NormalizedIngredientSchema = z.object({
  dto: IngredientInputSchema,
  stringValue: z.string().optional(),
  // $ZodFlattenedError<CreateIngredientDto>
  error: z
    .object({
      formErrors: z.array(z.string()),
      fieldErrors: z.object({
        name: z.array(z.string()).optional(),
        amount: z.array(z.string()).optional(),
        isFraction: z.array(z.string()).optional(),
        unit: z.array(z.string()).optional(),
      }),
    })
    .optional(),
});

const NormalizedStepSchema = z.object({
  id: z.string().optional(),
  instruction: z.string().nullable(),
  imageUrl: z.string().nullable(),
  ingredientIds: z.array(z.string()),
});

const NormalizedUserSchema = RecipeUserInputSchema;

const NormalizedRecipeSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
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

  validated.steps.forEach((step, stepIndex) => {
    const stepId = `step-${validated.id}-${step.id}`;

    const ingredientIds = step.ingredients.map((ing, ingIndex) => {
      const ingredientId = `ing-${stepId}-${ingIndex}`;
      ingredientsRecord[ingredientId] = {
        dto: {
          ...ing,
          id: ingredientId,
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

export const transformPartialRecipeToNormalized = (
  data: Partial<z.infer<typeof RecipeInputSchema>>,
) => {
  const id = data.id ?? '';
  const createdAt = data.createdAt ?? new Date().toISOString();
  const updatedAt = data.updatedAt ?? createdAt;

  const stepsRecord: Record<string, z.infer<typeof NormalizedStepSchema>> = {};
  const ingredientsRecord: Record<
    string,
    z.infer<typeof NormalizedIngredientSchema>
  > = {};

  (data.steps ?? []).forEach((step, stepIndex) => {
    const stepId = `step-${id}-${step.id ?? stepIndex}`;

    const ingredientIds = (step.ingredients ?? []).map((ing, ingIndex) => {
      const ingredientId = `ing-${stepId}-${ingIndex}`;
      ingredientsRecord[ingredientId] = {
        dto: {
          id: ingredientId,
          amount: ing.amount ?? 0,
          isFraction: ing.isFraction ?? false,
          unit: ing.unit ?? null,
          name: ing.name ?? '',
        },
        stringValue:
          `${ing.amount ?? 0} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim(),
      };
      return ingredientId;
    });

    stepsRecord[stepId] = {
      id: stepId,
      instruction: step.instruction ?? null,
      imageUrl: step.imageUrl ?? null,
      ingredientIds,
    };
  });

  const normalized: z.infer<typeof NormalizedRecipeSchema> = {
    id,
    createdAt,
    updatedAt,
    name: data.name ?? '',
    description: data.description ?? null,
    preparationTimeInMinutes: data.preparationTimeInMinutes ?? null,
    cookingTimeInMinutes: data.cookingTimeInMinutes ?? null,
    imageUrl: data.imageUrl ?? null,
    equipments: data.equipments ?? [],
    stepIds: Object.keys(stepsRecord),
    servings: data.servings ?? null,
    servingAmount: data.servingAmount ?? null,
    servingUnit: data.servingUnit ?? null,
    tags: data.tags ?? [],
    cuisine: data.cuisine ?? null,
    meal: data.meal ?? null,
    dish: data.dish ?? null,
    diets: data.diets ?? [],
    difficultyLevel: data.difficultyLevel ?? null,
    proteins: data.proteins ?? [],
    isPublic: data.isPublic ?? true,
    bookmarked: data.bookmarked ?? undefined,
    user: data.user ?? {
      id: '',
      handle: '',
      imageUrl: null,
      amIFollowing: undefined,
    },
    nutritionalFacts: data.nutritionalFacts ?? null,
    steps: stepsRecord,
    ingredients: ingredientsRecord,
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
