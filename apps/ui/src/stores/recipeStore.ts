import type {
  BadRequestRecipeResponse,
  CreateRecipeDto,
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  GenerateCategoriesDto,
  GenerateNutritionalFactsDto,
  MealType,
  NutritionalFactsResponse,
  ProteinType,
  RecipeResponseServingUnit,
} from '@repo/codegen/model';
import { roundToDecimal } from '@src/utils/calculate';
import { IngredientValidator } from '@src/utils/ingredientsValidator';
import { nutritionalFactsConst } from '@src/utils/nutritionalFacts';
import { NormalizedRecipe } from '@src/zod-schemas/recipeNormalized';
import { createStore } from 'zustand/vanilla';
import { applyMiddleware } from './middleware';

export type FactorType = 0.5 | 1 | 1.5 | 2 | 4;
export type RecipeState = Omit<NormalizedRecipe, 'imageUrl'> & {
  // This can be base64 (new/edited) or a URL (view)
  imageSrc: string | null;

  metadata: {
    isValid: boolean;
    errors: BadRequestRecipeResponse;
    scaleFactor: FactorType;
  };
};

export type RecipeActions = {
  setName: (_data: string) => void;
  setDescription: (_value: string) => void;
  setPreparationTimeInMinutes: (_value: number) => void;
  setCookingTimeInMinutes: (_value: number) => void;
  setImage: (_value: string | null) => void;
  setBookmarked: (_value: boolean) => void;
  addStep: () => void;
  insertIngredientsSteps: (
    _stepId: string,
    _ingredientId: string,
    _ingredients: string[][], // Changed to 1D array, caller will have to call this in a loop now when copy-pasting multiple step-ingredients
  ) => void;
  scaleIngredient: (_amount: number) => number;
  setScaleFactor: (_value: FactorType) => void;
  insertInstructionsSteps: (_keyId: string, _instructions: string[]) => void;
  removeStep: (_stepId: string) => void;
  addIngredient: (_stepId: string) => void;
  removeIngredient: (_stepId: string, _ingredientId: string) => void;
  updateIngredient: (_keyId: string, _ingredient: string) => void;
  setInstructions: (_keyId: string, _instructions: string) => void;
  setStepImage: (_keyId: string, _image: string | null) => void;
  setNutritionalFacts: (_value: NutritionalFactsResponse) => void;
  setPartialNutritionalFacts: (
    _value: Partial<NutritionalFactsResponse>,
  ) => void;
  setServingAmount: (_value: number | null) => void;
  setServingUnit: (_value: RecipeResponseServingUnit) => void;
  setServings: (_value: number | null) => void;
  setCuisine: (_value: CuisineType | null) => void;
  setMeal: (_value: MealType | null) => void;
  setDish: (_value: DishType | null) => void;
  setDiets: (_value: DietaryType[]) => void;
  setProteins: (_value: ProteinType[]) => void;
  setDifficultyLevel: (_value: DifficultyLevelType | null) => void;
  setTags: (_value: string[]) => void;
  makeCreateDto: () => CreateRecipeDto;
  makeGenerateNutritionalFactsDto: () => GenerateNutritionalFactsDto[];
  makeGenerateCategoriesDto: () => GenerateCategoriesDto;
  setErrors: (_data: BadRequestRecipeResponse) => void;
};

export type RecipeStore = RecipeState & RecipeActions;

export const defaultInitState: NormalizedRecipe = {
  name: '',
  createdAt: '',
  updatedAt: '',
  user: {
    id: '',
    handle: '',
    imageUrl: '',
  },
  description: null,
  imageUrl: null,
  preparationTimeInMinutes: null,
  cookingTimeInMinutes: null,
  equipments: [],
  ingredients: {},
  bookmarked: undefined,
  steps: {},
  stepIds: [],
  nutritionalFacts: null,
  servingAmount: null,
  servingUnit: null,
  servings: null,
  isPublic: true,
  tags: [],
  cuisine: null,
  diets: [],
  difficultyLevel: null,
  dish: null,
  meal: null,
  proteins: [],
};

export const createRecipeStore = (
  initState: NormalizedRecipe = defaultInitState,
) => {
  const { imageUrl, ...rest } = initState;
  return createStore<RecipeStore>()(
    applyMiddleware<RecipeStore>({
      afterMiddlware: (_, set) => {
        set((state) => ({
          metadata: {
            ...state.metadata,
            isValid:
              state.name !== '' &&
              state.stepIds.every((s) =>
                state.steps[s].ingredientIds.every(
                  (i) => state.ingredients[i].error === undefined,
                ),
              ),
          },
        }));
      },
      store: (set, get) => ({
        /**
         * todo: To help determine what fields actually changed during updates
         * check intialState (loop through Object.keys()) against state
         * Then I will only send what fields actually changed during an update/edit
         */
        ...rest,
        imageSrc: imageUrl ?? null,
        metadata: {
          isValid: false,
          errors: {},
          scaleFactor: 1,
        },
        setName: (name: string) => set(() => ({ name })),
        setDescription: (description: string) => set(() => ({ description })),
        setPreparationTimeInMinutes: (preparationTimeInMinutes: number) =>
          set(() => ({ preparationTimeInMinutes })),
        setCookingTimeInMinutes: (cookingTimeInMinutes: number) =>
          set(() => ({ cookingTimeInMinutes })),
        setImage: (imageSrc: string | null) => set(() => ({ imageSrc })),
        setBookmarked: (bookmarked: boolean) =>
          set((state) => {
            if (typeof state.bookmarked === 'boolean') {
              return { bookmarked };
            }
            return { bookmarked: state.bookmarked };
          }),
        addStep: () => {
          const id = crypto.randomUUID();
          set((state) => ({
            steps: {
              ...state.steps,
              [id]: { imageUrl: null, ingredientIds: [], instruction: null },
            },
            stepIds: [...state.stepIds, id],
          }));
        },
        removeStep: (stepId: string) => {
          set((state) => {
            const stepIds = state.stepIds.filter((id) => id !== stepId);
            delete state.steps[stepId];
            return { stepIds, steps: { ...state.steps } };
          });
        },
        addIngredient: (stepId: string) => {
          const id = crypto.randomUUID();
          set((state) => {
            const ingredient = new IngredientValidator({
              stringValue: '',
            });
            state.ingredients[id] = {
              dto: ingredient.dto,
              stringValue: ingredient.stringValue,
              error: ingredient.error,
            };
            state.steps[stepId].ingredientIds.push(id);
            return {
              ingredients: { ...state.ingredients },
              steps: { ...state.steps },
            };
          });
        },
        insertIngredientsSteps: (
          stepId: string,
          ingredientId: string,
          ingredients: string[][],
        ) => {
          set((state) => {
            const newIngredients = ingredients.map((dl) =>
              dl.map((d) => new IngredientValidator({ stringValue: d })),
            );

            const newIngredientIds: string[] = [];
            newIngredients.forEach((ingredientList) => {
              ingredientList.forEach((ingredient) => {
                const id = crypto.randomUUID();
                state.ingredients[id] = {
                  dto: ingredient.dto,
                  stringValue: ingredient.stringValue,
                  error: ingredient.error,
                };
                newIngredientIds.push(id);
              });
            });

            // Find the index of ingredientId and insert after it
            const insertIndex =
              state.steps[stepId].ingredientIds.indexOf(ingredientId);
            if (insertIndex !== -1) {
              state.steps[stepId].ingredientIds.splice(
                insertIndex + 1,
                0,
                ...newIngredientIds,
              );
            } else {
              state.steps[stepId].ingredientIds.push(...newIngredientIds);
            }

            return {
              ingredients: { ...state.ingredients },
              steps: { ...state.steps },
            };
          });
        },
        removeIngredient: (stepId: string, id: string) => {
          set((state) => {
            delete state.ingredients[id];
            state.steps[stepId].ingredientIds = state.steps[
              stepId
            ].ingredientIds.filter((ingredientId) => ingredientId !== id);
            return {
              ingredients: { ...state.ingredients },
              steps: { ...state.steps },
            };
          });
        },
        updateIngredient: (id: string, _ingredient: string) => {
          set((state) => {
            const ingredient = new IngredientValidator({
              stringValue: _ingredient,
            });
            state.ingredients[id].stringValue = ingredient.stringValue;
            state.ingredients[id].dto = ingredient.dto;
            state.ingredients[id].error = ingredient.error;
            return { ingredients: { ...state.ingredients } };
          });
        },
        setScaleFactor(scaleFactor: FactorType) {
          set((state) => ({ metadata: { ...state.metadata, scaleFactor } }));
        },
        scaleIngredient: (amount: number) => {
          return roundToDecimal(amount * get().metadata.scaleFactor, 2);
        },
        setInstructions: (stepId: string, instructions: string) =>
          set((state) => {
            state.steps[stepId].instruction = instructions;

            return { steps: { ...state.steps } };
          }),
        insertInstructionsSteps: (stepId: string, instructions: string[]) =>
          set((state) => {
            return state;
          }),
        setStepImage: (stepId: string, image: string | null) =>
          set((state) => {
            state.steps[stepId].imageUrl = image;

            return { steps: { ...state.steps } };
          }),
        setNutritionalFacts: (nutritionalFacts: NutritionalFactsResponse) =>
          set(() => ({ nutritionalFacts })),
        setPartialNutritionalFacts: (
          partial: Partial<NutritionalFactsResponse>,
        ) =>
          set((state) => {
            const merged = {
              ...nutritionalFactsConst,
              ...(state.nutritionalFacts ?? {}),
              ...partial,
            } as NutritionalFactsResponse;

            return { nutritionalFacts: merged };
          }),
        setServingAmount: (servingAmount: number | null) =>
          set(() => ({ servingAmount })),
        setServingUnit: (servingUnit: RecipeResponseServingUnit) =>
          set(() => ({ servingUnit })),
        setServings: (servings: number | null) => set(() => ({ servings })),
        setCuisine: (cuisine: CuisineType | null) => set(() => ({ cuisine })),
        setMeal: (meal: MealType | null) => set(() => ({ meal })),
        setDish: (dish: DishType | null) => set(() => ({ dish })),
        setDiets: (diets: DietaryType[]) => set(() => ({ diets })),
        setProteins: (proteins: ProteinType[]) => set(() => ({ proteins })),
        setDifficultyLevel: (difficultyLevel: DifficultyLevelType | null) =>
          set(() => ({ difficultyLevel })),
        setTags: (tags: string[]) => set(() => ({ tags })),
        makeCreateDto: () => {
          /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars -- unpacking unused vars */
          const {
            id,
            createdAt,
            updatedAt,
            user,
            imageSrc,
            isPublic,
            metadata,
            ...recipe
          } = get();
          /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars -- unpacking unused vars */

          return {
            ...recipe,
            isPublic: true, // TODO: handle making public and private
            base64Image: imageSrc?.split(',')[1] ?? null,
            steps: recipe.stepIds.map((s) => {
              return {
                ingredients: recipe.steps[s].ingredientIds.map(
                  (i) => recipe.ingredients[i].dto,
                ),
                instruction: recipe.steps[s].instruction,
                base64Image: recipe.steps[s].imageUrl?.split(',')[1] ?? null,
              };
            }),
          };
        },
        makeGenerateNutritionalFactsDto: () => {
          const { steps, ingredients, stepIds } = get();
          return stepIds.map((s) => {
            return {
              ingredients: steps[s].ingredientIds.map(
                (i) => ingredients[i].dto,
              ),
              instruction: steps[s].instruction,
            };
          });
        },
        makeGenerateCategoriesDto: () => {
          const { name, description, steps, ingredients, stepIds } = get();
          return {
            name,
            description,
            steps: stepIds.map((s) => {
              return {
                ingredients: steps[s].ingredientIds.map(
                  (i) => ingredients[i].dto,
                ),
                instruction: steps[s].instruction,
              };
            }),
          };
        },
        setErrors: (errors: BadRequestRecipeResponse) => {
          set((state) => ({ metadata: { ...state.metadata, errors } }));
        },
      }),
    }),
  );
};
