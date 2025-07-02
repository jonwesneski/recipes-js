/* eslint-disable no-unused-vars -- its fine zustand */
import type {
  CreateRecipeDto,
  NutritionalFactsDto,
} from '@repo/recipes-codegen/model';
import { IngredientsValidator } from '@src/utils/ingredientsValidator';
import { createRef, type RefObject } from 'react';
import { createStore } from 'zustand/vanilla';

export type StepsItemsType = {
  id: string;
  ref: RefObject<HTMLDivElement | null>;
  ingredientsRef?: RefObject<HTMLTextAreaElement | null>;
  ingredients: IngredientsValidator;
  shouldIngredientsBeFocused: boolean;
  instructionsRef?: RefObject<HTMLTextAreaElement | null>;
  instructions: string;
  shouldInstructionsBeFocused: boolean;
};

export type RecipeState = Omit<CreateRecipeDto, 'steps'> & {
  id: string;
  editEnabled: boolean;
  steps: StepsItemsType[];
};

export type RecipeActions = {
  setName: (_value: string) => void;
  setDescription: (_value: string) => void;
  setPreparationTimeInMinutes: (_value: number) => void;
  setCookingTimeInMinutes: (_value: number) => void;
  addStep: () => void;
  insertIngredientsSteps: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _ingredients: IngredientsValidator[],
  ) => void;
  insertInstructionsSteps: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _instructions: string[],
  ) => void;
  removeStep: (_stepId: string) => void;
  setIngredients: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _ingredients: IngredientsValidator,
  ) => void;
  setInstructions: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _instructions: string,
  ) => void;
  shouldBeFocused: (ref: RefObject<HTMLTextAreaElement | null>) => boolean;
  setNutritionalFacts: (_value: NutritionalFactsDto) => void;
  setTags: (_value: string[]) => void;
  setUserHandle: (_value: string) => void;
};

export type RecipeStore = RecipeState & RecipeActions;

const createStepItem = (params?: {
  ingredients?: IngredientsValidator;
  instructions?: string;
  shouldIngredientsBeFocused?: boolean;
  shouldInstructionsBeFocused?: boolean;
}): StepsItemsType => {
  return {
    id: crypto.randomUUID(),
    ref: createRef<HTMLDivElement>(),
    ingredientsRef: createRef<HTMLTextAreaElement>(),
    ingredients: params?.ingredients ?? new IngredientsValidator({ dto: [] }),
    shouldIngredientsBeFocused: params?.shouldIngredientsBeFocused ?? false,
    instructionsRef: createRef<HTMLTextAreaElement>(),
    instructions: params?.instructions ?? '',
    shouldInstructionsBeFocused: params?.shouldInstructionsBeFocused ?? false,
  };
};

export const defaultInitState: RecipeState = {
  editEnabled: false,
  id: '',
  name: '',
  description: null,
  base64Image: '',
  preparationTimeInMinutes: null,
  cookingTimeInMinutes: null,
  equipments: [],
  steps: [createStepItem()],
  nutritionalFacts: null,
  tags: [],
  userHandle: '',
};

export const createRecipeStore = (
  initState: RecipeState = defaultInitState,
) => {
  return createStore<RecipeStore>()((set, get) => ({
    ...initState,
    setName: (name: string) => set(() => ({ name })),
    setDescription: (description: string) => set(() => ({ description })),
    setPreparationTimeInMinutes: (preparationTimeInMinutes: number) =>
      set(() => ({ preparationTimeInMinutes })),
    setCookingTimeInMinutes: (cookingTimeInMinutes: number) =>
      set(() => ({ cookingTimeInMinutes })),
    setSteps: (steps: StepsItemsType[]) => set(() => ({ steps })),
    addStep: () => {
      set((state) => ({ steps: [...state.steps, createStepItem()] }));
    },
    removeStep: (stepId: string) => {
      set((state) => {
        const index = state.steps.findIndex((s) => s.id === stepId);
        if (index !== -1) {
          return { steps: state.steps.toSpliced(index, 1) };
        }
        return {};
      });
    },
    setIngredients: (
      ref: RefObject<HTMLTextAreaElement | null>,
      ingredients: IngredientsValidator,
    ) =>
      set((state) => {
        const index = state.steps.findIndex((s) => s.ingredientsRef === ref);
        if (index !== -1) {
          state.steps[index].ingredients = ingredients;
        }
        return { steps: [...state.steps] };
      }),
    insertIngredientsSteps: (
      ref: RefObject<HTMLTextAreaElement | null>,
      ingredients: IngredientsValidator[],
    ) =>
      set((state) => {
        let index = state.steps.findIndex((s) => s.ingredientsRef === ref);
        const inserts = ingredients.map((i) =>
          createStepItem({ ingredients: i }),
        );
        const current = state.steps.map((s) =>
          createStepItem({
            ingredients: s.ingredients,
            instructions: s.instructions,
          }),
        );
        if (inserts.length) {
          inserts[inserts.length - 1].shouldIngredientsBeFocused = true;
        }
        if (index !== -1) {
          for (const insert of inserts) {
            if (current[index]) {
              current[index].ingredients = insert.ingredients;
              current[index].ingredientsRef = insert.ingredientsRef;
              current[index].shouldIngredientsBeFocused =
                insert.shouldIngredientsBeFocused;
            } else {
              current.push(insert);
            }
            index++;
          }
          return { steps: current };
        }
        return { steps: [...current, ...inserts] };
      }),
    setInstructions: (
      ref: RefObject<HTMLTextAreaElement | null>,
      instructions: string,
    ) =>
      set((state) => {
        const index = state.steps.findIndex((s) => s.instructionsRef === ref);
        if (index !== -1) {
          state.steps[index].instructions = instructions;
        }
        return { steps: [...state.steps] };
      }),
    insertInstructionsSteps: (
      ref: RefObject<HTMLTextAreaElement | null>,
      instructions: string[],
    ) =>
      set((state) => {
        let index = state.steps.findIndex((s) => s.instructionsRef === ref);
        const inserts = instructions.map((i) =>
          createStepItem({ instructions: i }),
        );
        const current = state.steps.map((s) =>
          createStepItem({
            ingredients: s.ingredients,
            instructions: s.instructions,
          }),
        );
        if (inserts.length) {
          inserts[inserts.length - 1].shouldInstructionsBeFocused = true;
        }
        if (index !== -1) {
          for (const insert of inserts) {
            if (current[index]) {
              current[index].instructions = insert.instructions;
              current[index].instructionsRef = insert.instructionsRef;
              current[index].shouldInstructionsBeFocused =
                insert.shouldInstructionsBeFocused;
            } else {
              current.push(insert);
            }
            index++;
          }
          return { steps: current };
        }
        return { steps: [...current, ...inserts] };
      }),
    shouldBeFocused: (ref: RefObject<HTMLTextAreaElement | null>) => {
      return get().steps.some((s) => {
        if (s.ingredientsRef === ref) {
          return s.shouldIngredientsBeFocused;
        } else if (s.instructionsRef === ref) {
          return s.shouldInstructionsBeFocused;
        }
        return false;
      });
    },
    setNutritionalFacts: (nutritionalFacts: NutritionalFactsDto) =>
      set(() => ({ nutritionalFacts })),
    setTags: (tags: string[]) => set(() => ({ tags })),
    setUserHandle: (userHandle: string) => set(() => ({ userHandle })),
  }));
};
