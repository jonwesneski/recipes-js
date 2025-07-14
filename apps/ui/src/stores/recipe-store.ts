/* eslint-disable no-unused-vars -- its fine zustand */
import type { CreateRecipeDto, NutritionalFactsDto } from '@repo/codegen/model';
import { IngredientValidator } from '@src/utils/ingredientsValidator';
import { createRef, type RefObject } from 'react';
import { createStore } from 'zustand/vanilla';

export class IngredientItemType {
  keyId: string;
  ref: RefObject<HTMLTextAreaElement | null>;
  ingredient: IngredientValidator;
  private _shouldIngredientBeFocused: boolean;

  constructor({
    keyId = crypto.randomUUID(),
    ref = createRef<HTMLTextAreaElement>(),
    ingredient = new IngredientValidator({
      stringValue: '',
    }),
    shouldIngredientBeFocused = false,
  }: {
    keyId?: string;
    ref?: RefObject<HTMLTextAreaElement | null>;
    ingredient?: IngredientValidator;
    shouldIngredientBeFocused?: boolean;
  } = {}) {
    this.keyId = keyId;
    this.ref = ref;
    this.ingredient = ingredient;
    this._shouldIngredientBeFocused = shouldIngredientBeFocused;
  }

  get shouldIngredientBeFocused(): boolean {
    if (this._shouldIngredientBeFocused) {
      this._shouldIngredientBeFocused = false; // reset after getting
      return true;
    }
    return this._shouldIngredientBeFocused;
  }
}

export type IngredientItemsType = {
  keyId: string;
  ref: RefObject<HTMLDivElement | null>;
  items: IngredientItemType[];
};

export type StepsItemType = {
  keyId: string;
  ref: RefObject<HTMLDivElement | null>;
  ingredients: IngredientItemsType;
  instructionsRef?: RefObject<HTMLTextAreaElement | null>;
  instructions: string;
  shouldInstructionsBeFocused: boolean;
  image?: string;
};

export type RecipeState = Omit<CreateRecipeDto, 'steps'> & {
  id: string;
  editEnabled: boolean;
  steps: StepsItemType[];
};

export type RecipeActions = {
  setName: (_value: string) => void;
  setDescription: (_value: string) => void;
  setPreparationTimeInMinutes: (_value: number) => void;
  setCookingTimeInMinutes: (_value: number) => void;
  addStep: () => void;
  insertIngredientsSteps: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _ingredients: IngredientValidator[][],
  ) => void;
  insertInstructionsSteps: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _instructions: string[],
  ) => void;
  removeStep: (_stepId: string) => void;
  addIngredient: (ref: React.RefObject<HTMLTextAreaElement | null>) => void;
  removeIngredient: (ref: React.RefObject<HTMLTextAreaElement | null>) => void;
  updateIngredient: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _ingredient: IngredientValidator,
  ) => void;
  // setIngredients: (
  //   ref: RefObject<HTMLDivElement | null>,
  //   _ingredients: IngredientsValidator,
  // ) => void;
  setInstructions: (
    ref: RefObject<HTMLTextAreaElement | null>,
    _instructions: string,
  ) => void;
  setImage: (ref: RefObject<HTMLDivElement | null>, _image: string) => void;
  shouldBeFocused: (ref: RefObject<HTMLTextAreaElement | null>) => boolean;
  setNutritionalFacts: (_value: NutritionalFactsDto) => void;
  setTags: (_value: string[]) => void;
};

export type RecipeStore = RecipeState & RecipeActions;

const createStepItem = (params?: {
  ingredients?: IngredientItemsType;
  instructions?: string;
  shouldIngredientsBeFocused?: boolean;
  shouldInstructionsBeFocused?: boolean;
}): StepsItemType => {
  return {
    keyId: crypto.randomUUID(),
    ref: createRef<HTMLDivElement>(),
    ingredients: params?.ingredients! ?? createIngredientsItem(),
    instructionsRef: createRef<HTMLTextAreaElement>(),
    instructions: params?.instructions ?? '',
    shouldInstructionsBeFocused: params?.shouldInstructionsBeFocused ?? false,
  };
};

const createIngredientsItem = (): IngredientItemsType => {
  return {
    keyId: crypto.randomUUID(),
    ref: createRef<HTMLInputElement>(),
    items: [new IngredientItemType()],
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
    setSteps: (steps: StepsItemType[]) => set(() => ({ steps })),
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
    addIngredient: (ref: React.RefObject<HTMLTextAreaElement | null>) => {
      set((state) => {
        for (let s = 0; s < state.steps.length; s++) {
          for (let i = 0; i < state.steps[s].ingredients.items.length; i++) {
            if (state.steps[s].ingredients.items[i].ref === ref) {
              state.steps[s].ingredients.items = [
                ...state.steps[s].ingredients.items.slice(0, i + 1),
                new IngredientItemType({ shouldIngredientBeFocused: true }),
                ...state.steps[s].ingredients.items.slice(i + 1),
              ];
              return { steps: state.steps };
            }
          }
        }
        return { state };
      });
    },
    removeIngredient: (ref: React.RefObject<HTMLTextAreaElement | null>) => {
      set((state) => {
        for (let s = 0; s < state.steps.length; s++) {
          for (let i = 0; i < state.steps[s].ingredients.items.length; i++) {
            if (state.steps[s].ingredients.items[i].ref === ref) {
              state.steps[s].ingredients.items.splice(i, 1);
              return { steps: [...state.steps] };
            }
          }
        }
        return { state };
      });
    },
    updateIngredient: (
      ref: RefObject<HTMLTextAreaElement | null>,
      ingredient: IngredientValidator,
    ) =>
      set((state) => {
        for (let s = 0; s < state.steps.length; s++) {
          for (let i = 0; i < state.steps[s].ingredients.items.length; i++) {
            if (state.steps[s].ingredients.items[i].ref === ref) {
              state.steps[s].ingredients.items[i].ingredient = ingredient;
              return { steps: [...state.steps] };
            }
          }
        }
        return { state };
      }),
    // setIngredients: (
    //   ref: RefObject<HTMLDivElement | null>,
    //   ingredients: IngredientsValidator,
    // ) =>
    //   set((state) => {
    //     const index = state.steps.findIndex((s) => s.ingredientsRef === ref);
    //     if (index !== -1) {
    //       state.steps[index].ingredients = ingredients;
    //     }
    //     return { steps: [...state.steps] };
    //   }),
    insertIngredientsSteps: (
      ref: RefObject<HTMLTextAreaElement | null>,
      ingredients: IngredientValidator[][],
    ) =>
      set((state) => {
        for (let s = 0; s < state.steps.length; s++) {
          for (let i = 0; i < state.steps[s].ingredients.items.length; i++) {
            if (state.steps[s].ingredients.items[i].ref === ref) {
              const currentIngredient =
                state.steps[s].ingredients.items[i].ingredient;
              const updatedCurrentIngredient = new IngredientValidator({
                stringValue:
                  currentIngredient.stringValue + ingredients[0][0].stringValue,
              });
              state.steps[s].ingredients.items[i].ingredient =
                updatedCurrentIngredient;

              for (let j = 1; j < ingredients.length; j++) {
                state.steps.push(createStepItem());
                state.steps[state.steps.length - 1].ingredients.items =
                  ingredients[j].map(
                    (ing) => new IngredientItemType({ ingredient: ing }),
                  );
              }

              return { steps: [...state.steps] };
            }
          }
        }
        return { state };
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
    setImage: (ref: RefObject<HTMLDivElement | null>, image: string) =>
      set((state) => {
        const index = state.steps.findIndex((s) => s.ref === ref);
        if (index !== -1) {
          state.steps[index].image = image;
        }
        return { steps: [...state.steps] };
      }),
    shouldBeFocused: (ref: RefObject<HTMLTextAreaElement | null>) => {
      return false;
      // return get().steps.some((s) => {
      //   if (s.ingredientsRef === ref) {
      //     return s.shouldIngredientsBeFocused;
      //   } else if (s.instructionsRef === ref) {
      //     return s.shouldInstructionsBeFocused;
      //   }
      //   return false;
      // });
    },
    setNutritionalFacts: (nutritionalFacts: NutritionalFactsDto) =>
      set(() => ({ nutritionalFacts })),
    setTags: (tags: string[]) => set(() => ({ tags })),
  }));
};
