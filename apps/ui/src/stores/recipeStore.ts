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
import type {
  NormalizedIngredient,
  NormalizedRecipe,
} from '@src/zod-schemas/recipeNormalized';
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
  ) => string;
  scaleIngredient: (_amount: number) => number;
  setScaleFactor: (_value: FactorType) => void;
  insertInstructionsSteps: (_stepId: string, _instructions: string[]) => string;
  removeStep: (_stepId: string) => void;
  addIngredient: (_stepId: string) => void;
  removeIngredient: (_stepId: string, _ingredientId: string) => void;
  updateIngredient: (_keyId: string, _ingredient: string) => void;
  setInstructions: (_keyId: string, _instructions: string) => void;
  setStepImage: (_stepId: string, _image: string | null) => void;
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

const createStep = (options?: {
  instruction?: string;
  ingredients?: IngredientValidator[];
}) => {
  const ingredientValidators = options?.ingredients ?? [
    new IngredientValidator({ stringValue: '' }),
  ];
  const stepId = crypto.randomUUID();
  const ingredientIds: string[] = Array.from(
    { length: ingredientValidators.length },
    () => crypto.randomUUID(),
  );
  const ingredients: Record<string, NormalizedIngredient> =
    ingredientIds.reduce<Record<string, NormalizedIngredient>>((acc, id, i) => {
      acc[id] = {
        stringValue: ingredientValidators[i].stringValue,
        dto: {
          amount: ingredientValidators[i].dto.amount,
          unit: ingredientValidators[i].dto.unit,
          name: ingredientValidators[i].dto.name,
          isFraction: ingredientValidators[i].dto.isFraction,
        },
        error: ingredientValidators[i].error,
      };
      return acc;
    }, {});

  return {
    stepId,
    imageUrl: null,
    instruction: options?.instruction ?? null,
    ingredientIds,
    ingredients,
  };
};

const defaultStep = createStep();
export const defaultInitState: NormalizedRecipe = {
  id: '',
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
  ingredients: defaultStep.ingredients,
  bookmarked: undefined,
  steps: {
    [defaultStep.stepId]: {
      imageUrl: defaultStep.imageUrl,
      ingredientIds: defaultStep.ingredientIds,
      instruction: defaultStep.instruction,
    },
  },
  stepIds: [defaultStep.stepId],
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

let isValid = true;
export const createRecipeStore = (
  initState: NormalizedRecipe = defaultInitState,
) => {
  const { imageUrl, ...rest } = initState;
  return createStore<RecipeStore>()(
    applyMiddleware<RecipeStore>({
      afterMiddlware: (_, _set, get) => {
        const state = get();
        isValid =
          state.name !== '' &&
          state.stepIds.every((s) =>
            state.steps[s].ingredientIds.every(
              (i) => !Object.hasOwn(state.ingredients[i], 'error'),
            ),
          );
      },
      store: (set, get) => ({
        /**
         * todo: To help determine what fields actually changed during updates
         * check intialState (loop through Object.keys()) against state
         * Then I will only send what fields actually changed during an update/edit
         */
        ...structuredClone(rest),
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
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- deleting dynamic key
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
          let lastInsertStepId: string = stepId;
          set((state) => {
            const stepIdIndex = state.stepIds.indexOf(stepId);
            if (stepIdIndex === -1) {
              return state;
            }

            const existingStepExistingIngredient = new IngredientValidator({
              stringValue:
                state.ingredients[ingredientId].stringValue + ingredients[0][0],
            });
            state.ingredients[ingredientId] = {
              dto: existingStepExistingIngredient.dto,
              stringValue: existingStepExistingIngredient.stringValue,
              error: existingStepExistingIngredient.error,
            };

            const existingStepNewIngredients = ingredients[0]
              .filter((_, i) => i > 0)
              .map(
                (ing) =>
                  new IngredientValidator({
                    stringValue: ing,
                  }),
              );
            existingStepNewIngredients.forEach((ing) => {
              const newId = crypto.randomUUID();
              state.ingredients[newId] = {
                dto: ing.dto,
                stringValue: ing.stringValue,
                error: ing.error,
              };
              state.steps[stepId].ingredientIds.push(newId);
            });

            const newStepIds: string[] = [];
            let insertAtIndex = NaN;
            for (let i = 1; i < ingredients.length; i++) {
              const newIngredients = ingredients[i].map(
                (ing) =>
                  new IngredientValidator({
                    stringValue: ing,
                  }),
              );
              const existingStepId = state.stepIds[stepIdIndex + i];
              if (
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- existingStepId can be undefined
                state.steps[existingStepId]?.ingredientIds.length > 1 ||
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- existingStepId can be undefined
                !state.steps[existingStepId]
              ) {
                // Create/Insert New
                const newStep = createStep({
                  ingredients: newIngredients,
                });
                state.steps[newStep.stepId] = {
                  instruction: newStep.instruction,
                  ingredientIds: newStep.ingredientIds,
                  imageUrl: newStep.imageUrl,
                };
                newStep.ingredientIds.forEach((id) => {
                  state.ingredients[id] = newStep.ingredients[id];
                });
                newStepIds.push(newStep.stepId);
              } else if (
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- existingStepId can be undefined
                state.steps[existingStepId]?.ingredientIds.length === 1
              ) {
                // Empty ingredients
                state.ingredients[
                  state.steps[existingStepId].ingredientIds[0]
                ] = {
                  dto: newIngredients[0].dto,
                  stringValue: newIngredients[0].stringValue,
                  error: newIngredients[0].error,
                };
                for (let j = 1; j < newIngredients.length; i++) {
                  const newId = crypto.randomUUID();
                  state.ingredients[newId] = {
                    dto: newIngredients[j].dto,
                    stringValue: newIngredients[j].stringValue,
                    error: newIngredients[j].error,
                  };
                  state.steps[existingStepId].ingredientIds.push(newId);
                }
              } else {
                // First empty/existing Step
                if (Number.isNaN(insertAtIndex)) {
                  insertAtIndex = stepIdIndex + i;
                }
                newIngredients.forEach((ing) => {
                  const newId = crypto.randomUUID();
                  state.ingredients[newId] = {
                    dto: ing.dto,
                    stringValue: ing.stringValue,
                    error: ing.error,
                  };
                  state.steps[existingStepId].ingredientIds.push(newId);
                });
              }
            }

            // Insert new stepIds after the current stepId
            insertAtIndex = Number.isNaN(insertAtIndex)
              ? state.stepIds.length - 1
              : insertAtIndex;
            state.stepIds.splice(insertAtIndex + 1, 0, ...newStepIds);

            lastInsertStepId = newStepIds.at(-1) ?? lastInsertStepId;

            return {
              ingredients: { ...state.ingredients },
              steps: { ...state.steps },
              stepIds: [...state.stepIds],
            };
          });
          return lastInsertStepId;
        },
        removeIngredient: (stepId: string, id: string) => {
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- deleting dynamic key
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
        insertInstructionsSteps: (
          stepId: string,
          instructionsList: string[],
        ) => {
          let lastInsertStepId: string = stepId;
          set((state) => {
            const stepIdIndex = state.stepIds.indexOf(stepId);
            if (stepIdIndex === -1) {
              return state;
            }

            // Existing instruction
            if (state.steps[stepId].instruction) {
              state.steps[stepId].instruction += instructionsList[0];
            } else {
              state.steps[stepId].instruction = instructionsList[0];
            }

            const newStepIds: string[] = [];
            let insertAtIndex = NaN;
            for (let i = 1; i < instructionsList.length; i++) {
              const existingStepId = state.stepIds[stepIdIndex + i];
              if (
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- existingStepId can be undefined
                state.steps[existingStepId]?.instruction ||
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- existingStepId can be undefined
                !state.steps[existingStepId]
              ) {
                // Create/Insert New
                const newStep = createStep({
                  instruction: instructionsList[i],
                });
                state.steps[newStep.stepId] = {
                  instruction: newStep.instruction,
                  ingredientIds: newStep.ingredientIds,
                  imageUrl: newStep.imageUrl,
                };
                const defaultIngredientId = Object.keys(newStep.ingredients)[0];
                state.ingredients[defaultIngredientId] =
                  newStep.ingredients[defaultIngredientId];
                newStepIds.push(newStep.stepId);
              } else {
                // First empty/existing
                if (Number.isNaN(insertAtIndex)) {
                  insertAtIndex = stepIdIndex + i;
                }
                state.steps[existingStepId].instruction = instructionsList[i];
              }
            }

            // Insert new stepIds after the current stepId
            insertAtIndex = Number.isNaN(insertAtIndex)
              ? state.stepIds.length - 1
              : insertAtIndex;
            state.stepIds.splice(insertAtIndex + 1, 0, ...newStepIds);

            lastInsertStepId = newStepIds.at(-1) ?? lastInsertStepId;

            return { steps: { ...state.steps }, stepIds: [...state.stepIds] };
          });
          return lastInsertStepId;
        },
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
          if (!isValid) throw new Error();

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
