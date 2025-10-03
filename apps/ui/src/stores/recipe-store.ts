import type {
  BadRequestRecipeEntity,
  CreateRecipeDto,
  GenerateNutritionalFactsDto,
  NutritionalFactsDto,
  RecipeEntity,
} from '@repo/codegen/model';
import { IngredientValidator } from '@src/utils/ingredientsValidator';
import { roundToDecimal } from '@src/utils/measurements';
import { createStore } from 'zustand/vanilla';
import { applyMiddleware } from './middleware';

export class ItemTypeBase {
  keyId: string;
  private _shouldBeFocused: boolean;

  constructor({
    keyId = crypto.randomUUID(),
    shouldBeFocused = false,
  }: {
    keyId?: string;
    shouldBeFocused?: boolean;
  } = {}) {
    this.keyId = keyId;
    this._shouldBeFocused = shouldBeFocused;
  }

  get shouldBeFocused(): boolean {
    if (this._shouldBeFocused) {
      this._shouldBeFocused = false; // reset after getting
      return true;
    }
    return this._shouldBeFocused;
  }

  set shouldBeFocused(value: boolean) {
    if (value) {
      this.keyId = crypto.randomUUID();
    }
    this._shouldBeFocused = value;
  }
}

export class IngredientItemType extends ItemTypeBase {
  ingredient: IngredientValidator;

  constructor({
    keyId = crypto.randomUUID(),
    shouldBeFocused = false,
    ingredient = new IngredientValidator({
      stringValue: '',
    }),
  }: {
    keyId?: string;
    shouldBeFocused?: boolean;
    ingredient?: IngredientValidator;
  } = {}) {
    super({ keyId, shouldBeFocused });
    this.ingredient = ingredient;
  }
}

export class InstructionsType extends ItemTypeBase {
  value: string;

  constructor({
    keyId = crypto.randomUUID(),
    shouldBeFocused = false,
    value = '',
  }: {
    keyId?: string;
    shouldBeFocused?: boolean;
    value?: string;
  } = {}) {
    super({ keyId, shouldBeFocused });
    this.value = value;
  }
}

export type IngredientItemsType = {
  keyId: string;
  items: IngredientItemType[];
};

export type StepItemType = {
  keyId: string;
  ingredients: IngredientItemsType;
  instructions: InstructionsType;
  image: string | null;
};

export type FactorType = 0.5 | 1 | 1.5 | 2 | 4;

export type RecipeState = Omit<RecipeEntity, 'steps' | 'imageUrl'> & {
  id: string;
  imageSrc: string | null;
  steps: StepItemType[];
  isValid: boolean;
  errors: BadRequestRecipeEntity;
  scaleFactor: FactorType;
};

export type RecipeActions = {
  setName: (_data: string) => void;
  setDescription: (_value: string) => void;
  setPreparationTimeInMinutes: (_value: number) => void;
  setCookingTimeInMinutes: (_value: number) => void;
  setImage: (_value: string | null) => void;
  addStep: () => void;
  insertIngredientsSteps: (
    _keyId: string,
    _ingredients: IngredientValidator[][],
  ) => void;
  scaleIngredient: (_amount: number) => number;
  setScaleFactor: (_value: FactorType) => void;
  insertInstructionsSteps: (_keyId: string, _instructions: string[]) => void;
  removeStep: (_stepId: string) => void;
  addIngredient: (_keyId: string) => void;
  removeIngredient: (_keyId: string) => void;
  updateIngredient: (_keyId: string, _ingredient: IngredientValidator) => void;
  setInstructions: (_keyId: string, _instructions: string) => void;
  setStepImage: (_keyId: string, _image: string | null) => void;
  setNutritionalFacts: (_value: NutritionalFactsDto) => void;
  setTags: (_value: string[]) => void;
  makeCreateDto: () => CreateRecipeDto;
  makeGenerateNutritionalFactsDto: () => GenerateNutritionalFactsDto[];
  setErrors: (_data: BadRequestRecipeEntity) => void;
};

export type RecipeStore = RecipeState & RecipeActions;

export const createStepItem = (params?: {
  ingredients?: IngredientItemsType;
  instructions?: InstructionsType;
}): StepItemType => {
  return {
    keyId: crypto.randomUUID(),
    ingredients: params?.ingredients ?? createIngredientsItem(),
    instructions: params?.instructions ?? new InstructionsType(),
    image: null,
  };
};

export const createIngredientsItem = (
  items?: IngredientItemType[],
): IngredientItemsType => {
  return {
    keyId: crypto.randomUUID(),
    items: items ?? [new IngredientItemType()],
  };
};

export const defaultInitState: RecipeState = {
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
  imageSrc: null,
  preparationTimeInMinutes: null,
  cookingTimeInMinutes: null,
  equipments: [],
  steps: [createStepItem()],
  nutritionalFacts: null,
  isPublic: true,
  tags: [],
  isValid: false,
  errors: {},
  scaleFactor: 1,
};

export const createRecipeStore = (
  initState: RecipeState = defaultInitState,
) => {
  return createStore<RecipeStore>()(
    applyMiddleware<RecipeStore>({
      afterMiddlware: (_, set) => {
        set((state) => ({
          isValid:
            state.name !== '' &&
            state.steps.every((s) =>
              s.ingredients.items.every(
                (i) => i.ingredient.error === undefined,
              ),
            ),
        }));
      },
      store: (set, get) => ({
        ...initState,
        setName: (name: string) => set(() => ({ name })),
        setDescription: (description: string) => set(() => ({ description })),
        setPreparationTimeInMinutes: (preparationTimeInMinutes: number) =>
          set(() => ({ preparationTimeInMinutes })),
        setCookingTimeInMinutes: (cookingTimeInMinutes: number) =>
          set(() => ({ cookingTimeInMinutes })),
        setImage: (imageSrc: string | null) => set(() => ({ imageSrc })),
        setSteps: (steps: StepItemType[]) => set(() => ({ steps })),
        addStep: () => {
          set((state) => ({ steps: [...state.steps, createStepItem()] }));
        },
        removeStep: (stepId: string) => {
          set((state) => {
            const index = state.steps.findIndex((s) => s.keyId === stepId);
            if (index !== -1) {
              return { steps: state.steps.toSpliced(index, 1) };
            }
            return {};
          });
        },
        addIngredient: (keyId: string) => {
          set((state) => {
            for (let s = 0; s < state.steps.length; s++) {
              for (
                let i = 0;
                i < state.steps[s].ingredients.items.length;
                i++
              ) {
                if (state.steps[s].ingredients.items[i].keyId === keyId) {
                  state.steps[s].ingredients.items = [
                    ...state.steps[s].ingredients.items.slice(0, i + 1),
                    new IngredientItemType({ shouldBeFocused: true }),
                    ...state.steps[s].ingredients.items.slice(i + 1),
                  ];
                  return { steps: state.steps };
                }
              }
            }
            return { state };
          });
        },
        removeIngredient: (keyId: string) => {
          set((state) => {
            for (let s = 0; s < state.steps.length; s++) {
              for (
                let i = 0;
                i < state.steps[s].ingredients.items.length;
                i++
              ) {
                if (state.steps[s].ingredients.items[i].keyId === keyId) {
                  if (state.steps[s].ingredients.items.length <= 1) {
                    return { state };
                  }
                  if (state.steps[s].ingredients.items[i - 1]) {
                    state.steps[s].ingredients.items[i - 1].shouldBeFocused =
                      true;
                  }
                  state.steps[s].ingredients.items.splice(i, 1);
                  return { steps: [...state.steps] };
                }
              }
            }
            return { state };
          });
        },
        updateIngredient: (keyId: string, ingredient: IngredientValidator) =>
          set((state) => {
            for (let s = 0; s < state.steps.length; s++) {
              for (
                let i = 0;
                i < state.steps[s].ingredients.items.length;
                i++
              ) {
                if (state.steps[s].ingredients.items[i].keyId === keyId) {
                  state.steps[s].ingredients.items[i].ingredient = ingredient;
                  return { steps: [...state.steps] };
                }
              }
            }
            return { state };
          }),
        insertIngredientsSteps: (
          keyId: string,
          ingredients: IngredientValidator[][],
        ) =>
          set((state) => {
            let stepIndex = -1;
            for (let s = 0; s < state.steps.length; s++) {
              for (
                let i = 0;
                i < state.steps[s].ingredients.items.length;
                i++
              ) {
                if (state.steps[s].ingredients.items[i].keyId === keyId) {
                  stepIndex = s;
                  break;
                }
              }
            }
            const inserts = ingredients.map((i) =>
              createStepItem({
                ingredients: createIngredientsItem(
                  i.map((iv) => new IngredientItemType({ ingredient: iv })),
                ),
              }),
            );

            // Focus on the last
            if (inserts.length) {
              const lastIngredientIndex =
                inserts[inserts.length - 1].ingredients.items.length - 1;
              const ingredientItem =
                inserts[inserts.length - 1].ingredients.items[
                  lastIngredientIndex
                ];
              inserts[inserts.length - 1].ingredients.items[
                lastIngredientIndex
              ] = new IngredientItemType({
                ingredient: ingredientItem.ingredient,
                shouldBeFocused: true,
              });
            }

            const current = state.steps.map((s) =>
              createStepItem({
                ingredients: s.ingredients,
                instructions: s.instructions,
              }),
            );
            if (stepIndex !== -1) {
              for (const insert of inserts) {
                if (current[stepIndex]) {
                  current[stepIndex].ingredients = insert.ingredients;
                } else {
                  current.push(insert);
                }
                stepIndex++;
              }
              return { steps: current };
            }
            return { steps: [...current, ...inserts] };
          }),
        setScaleFactor(scaleFactor: FactorType) {
          set(() => ({ scaleFactor }));
        },
        // Getting an infinite loop here with zustand if I try to use scaleFactor from get()
        // So I am not using at the moment
        scaleIngredient: (amount: number) => {
          return roundToDecimal(amount * get().scaleFactor, 2);
        },
        setInstructions: (keyId: string, instructions: string) =>
          set((state) => {
            const index = state.steps.findIndex(
              (s) => s.instructions.keyId === keyId,
            );
            if (index !== -1) {
              state.steps[index].instructions = new InstructionsType({
                value: instructions,
              });
            }
            return { steps: [...state.steps] };
          }),
        insertInstructionsSteps: (keyId: string, instructions: string[]) =>
          set((state) => {
            let index = state.steps.findIndex(
              (s) => s.instructions.keyId === keyId,
            );
            const inserts = instructions.map((i) =>
              createStepItem({
                instructions: new InstructionsType({ value: i }),
              }),
            );
            if (inserts.length) {
              inserts[inserts.length - 1].instructions = new InstructionsType({
                value: inserts[inserts.length - 1].instructions.value,
                shouldBeFocused: true,
              });
            }

            const current = state.steps.map((s) =>
              createStepItem({
                ingredients: s.ingredients,
                instructions: s.instructions,
              }),
            );
            if (index !== -1) {
              for (const insert of inserts) {
                if (current[index]) {
                  current[index].instructions = insert.instructions;
                } else {
                  current.push(insert);
                }
                index++;
              }
              return { steps: current };
            }
            return { steps: [...current, ...inserts] };
          }),
        setStepImage: (keyId: string, image: string | null) =>
          set((state) => {
            const index = state.steps.findIndex((s) => s.keyId === keyId);
            if (index !== -1) {
              state.steps[index].image = image;
            }
            return { steps: [...state.steps] };
          }),
        setNutritionalFacts: (nutritionalFacts: NutritionalFactsDto) =>
          set(() => ({ nutritionalFacts })),
        setTags: (tags: string[]) => set(() => ({ tags })),
        makeCreateDto: () => {
          /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars -- unpacking unused vars */
          const {
            id,
            createdAt,
            updatedAt,
            user,
            isValid,
            errors,
            imageSrc,
            scaleFactor,
            ...recipe
          } = get();
          /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars -- unpacking unused vars */

          return {
            ...recipe,
            base64Image: imageSrc?.split(',')[1] ?? null,
            steps: recipe.steps.map((s) => {
              return {
                ingredients: s.ingredients.items.map((i) => i.ingredient.dto),
                instruction: s.instructions.value,
                base64Image: s.image?.split(',')[1] ?? null,
              };
            }),
          };
        },
        makeGenerateNutritionalFactsDto: () => {
          const steps = get().steps;
          return steps.map((s) => {
            return {
              ingredients: s.ingredients.items.map((i) => i.ingredient.dto),
              instruction: s.instructions.value,
            };
          });
        },
        setErrors: (errors: BadRequestRecipeEntity) => {
          set(() => ({ errors }));
        },
      }),
    }),
  );
};
